import { CanvasAxis } from "../../../../../../core/models/misc/CanvasAxis";
import { IObj } from "../../../../../../core/models/objs/IObj";
import { PathObj } from "../../../../../../core/models/objs/PathObj";
import { ChildShape } from "../../../../../../core/models/shapes/child_views/ChildShape";
import { ShapeJson, ShapeFactoryAdapter, AbstractShape } from "../../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../../core/Registry";
import { Point } from "../../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../../utils/geometry/shapes/Rectangle";
import { MoveAxisViewRenderer } from "../../../renderers/edit/MoveAxisViewRenderer";
import { Canvas2dPanel } from "../../../../../../core/models/modules/Canvas2dPanel";

export interface AxisShapeJson extends ShapeJson {
    point: string;
    parentId: string; 
}

export const MoveAxisShapeType = 'move-axis-shape';

export class MoveAxisShapeFactory extends ShapeFactoryAdapter {
    private registry: Registry;
    private canvas: Canvas2dPanel;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    instantiate() {
        // TODO: does not make sense to create only one of the axis
        return new MoveAxisView(this.registry, this.canvas, CanvasAxis.X);
    }

    instantiateOnSelection(parentView: AbstractShape) {
        let moveAxisView = new MoveAxisView(this.registry, this.canvas, CanvasAxis.X);
        moveAxisView.setContainerView(parentView);
        parentView.addContainedView(moveAxisView);

        moveAxisView = new MoveAxisView(this.registry, this.canvas, CanvasAxis.Y);
        moveAxisView.setContainerView(parentView);
        parentView.addContainedView(moveAxisView);

        moveAxisView = new MoveAxisView(this.registry, this.canvas, CanvasAxis.Z);
        moveAxisView.setContainerView(parentView);
        parentView.addContainedView(moveAxisView);
    }
}

export class MoveAxisView extends ChildShape {
    readonly id: string;
    readonly axis: CanvasAxis;
    readonly viewType = MoveAxisShapeType;
    point: Point;
    readonly containerShape: AbstractShape;

    constructor(registry: Registry, canvas: Canvas2dPanel, axis: CanvasAxis) {
        super(canvas);
        this.axis = axis;
        this.bounds = new Rectangle(new Point(0, 0), new Point(40, 5));
        this.renderer = new MoveAxisViewRenderer(registry);
        this.id = `${MoveAxisShapeType}-${this.axis}`.toLowerCase();
    }

    getObj(): IObj {
        return this.containerShape.getObj();
    }

    setObj(obj: PathObj) {
        this.containerShape.setObj(obj);
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
        const center = this.containerShape.getBounds().getBoundingCenter();
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
            parentId: this.containerShape.id,
        }
    }

    fromJson(json: AxisShapeJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}