import { CanvasAxis } from "../../../../../../core/models/misc/CanvasAxis";
import { IObj } from "../../../../../../core/models/objs/IObj";
import { PathObj } from "../../../../../../core/models/objs/PathObj";
import { ChildShape } from "../../../../../../core/models/shapes/child_views/ChildShape";
import { AbstractShape, ShapeFactoryAdapter, ShapeJson } from "../../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../../core/Registry";
import { Point } from "../../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../../utils/geometry/shapes/Rectangle";
import { RotateAxisViewRenderer } from "../../../renderers/edit/RotateAxisViewRenderer";

export interface AxisShapeJson extends ShapeJson {
    point: string;
    parentId: string; 
}

export const RotateAxisShapeType = 'rotate-axis-shape';

export class RotateAxisShapeFactory extends ShapeFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        // TODO: does not make sense to create only one of the axis
        return new RotateAxisView(this.registry, CanvasAxis.X);
    }

    instantiateOnSelection(parentView: AbstractShape) {
        let scaleView = new RotateAxisView(this.registry, CanvasAxis.X);
        scaleView.setContainerView(parentView);
        parentView.addContainedView(scaleView);

        scaleView = new RotateAxisView(this.registry, CanvasAxis.Y);
        scaleView.setContainerView(parentView);
        parentView.addContainedView(scaleView);

        scaleView = new RotateAxisView(this.registry, CanvasAxis.Z);
        scaleView.setContainerView(parentView);
        parentView.addContainedView(scaleView);
    }
}

export class RotateAxisView extends ChildShape {
    readonly id: string;
    readonly axis: CanvasAxis;
    readonly viewType = RotateAxisShapeType;
    point: Point;
    readonly containerView: AbstractShape;

    constructor(registry: Registry, axis: CanvasAxis) {
        super();
        this.axis = axis;
        this.bounds = new Rectangle(new Point(0, 0), new Point(40, 5));
        this.renderer = new RotateAxisViewRenderer(registry);
        this.id = `${RotateAxisShapeType}-${this.axis}`.toLowerCase();
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