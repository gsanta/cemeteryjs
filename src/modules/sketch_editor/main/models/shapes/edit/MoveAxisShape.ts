import { CanvasAxis } from "../../../../../../core/models/misc/CanvasAxis";
import { IObj } from "../../../../../../core/models/objs/IObj";
import { PathObj } from "../../../../../../core/models/objs/PathObj";
import { ChildShape } from "../../../../../../core/models/views/child_views/ChildShape";
import { ShapeJson, ShapeFactoryAdapter, AbstractShape } from "../../../../../../core/models/views/AbstractShape";
import { Registry } from "../../../../../../core/Registry";
import { Point } from "../../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../../utils/geometry/shapes/Rectangle";
import { MoveAxisViewRenderer } from "../../../renderers/edit/MoveAxisViewRenderer";

export interface AxisShapeJson extends ShapeJson {
    point: string;
    parentId: string; 
}

export const MoveAxisShapeType = 'move-axis-shape';

export class MoveAxisShapeFactory extends ShapeFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        // TODO: does not make sense to create only one of the axis
        return new MoveAxisView(this.registry, CanvasAxis.X);
    }

    instantiateOnSelection(parentView: AbstractShape) {
        let moveAxisView = new MoveAxisView(this.registry, CanvasAxis.X);
        moveAxisView.setContainerView(parentView);
        parentView.addContainedView(moveAxisView);

        moveAxisView = new MoveAxisView(this.registry, CanvasAxis.Y);
        moveAxisView.setContainerView(parentView);
        parentView.addContainedView(moveAxisView);

        moveAxisView = new MoveAxisView(this.registry, CanvasAxis.Z);
        moveAxisView.setContainerView(parentView);
        parentView.addContainedView(moveAxisView);
    }
}

export class MoveAxisView extends ChildShape {
    readonly id: string;
    readonly axis: CanvasAxis;
    readonly viewType = MoveAxisShapeType;
    point: Point;
    readonly containerView: AbstractShape;

    constructor(registry: Registry, axis: CanvasAxis) {
        super();
        this.axis = axis;
        this.bounds = new Rectangle(new Point(0, 0), new Point(40, 5));
        this.renderer = new MoveAxisViewRenderer(registry);
        this.id = `${MoveAxisShapeType}-${this.axis}`.toLowerCase();
    }

    getObj(): IObj {
        return this.containerView.getObj();
    }

    setObj(obj: PathObj) {
        this.containerView.setObj(obj);
    }

    move(delta: Point) {
        this.point.add(delta);
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    calcBounds() {
        const center = this.containerView.getBounds().getBoundingCenter();
        this.setBounds(new Rectangle(new Point(center.x - 8, center.y - 60), new Point(center.x + 8, center.y)));
    }

    dispose() {}

    toString() {
        return `${this.viewType}`;
    }

    toJson(): AxisShapeJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            parentId: this.containerView.id,
        }
    }

    fromJson(json: AxisShapeJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}