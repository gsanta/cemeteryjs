import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { IObj } from "../../../../../core/models/objs/IObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { ContainedView } from "../../../../../core/models/views/child_views/ChildView";
import { View, ViewFactoryAdapter, ViewJson } from "../../../../../core/models/views/View";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { ScaleAxisViewRenderer } from "./ScaleAxisViewRenderer";

export interface AxisViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const ScaleAxisViewType = 'scale-axis-view';

export class ScaleAxisViewFactory extends ViewFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        // TODO: does not make sense to create only one of the axis
        return new ScaleAxisView(this.registry, CanvasAxis.X);
    }

    instantiateOnSelection(parentView: View) {
        let axisView = new ScaleAxisView(this.registry, CanvasAxis.X);
        axisView.setContainerView(parentView);
        parentView.addContainedView(axisView);

        axisView = new ScaleAxisView(this.registry, CanvasAxis.Y);
        axisView.setContainerView(parentView);
        parentView.addContainedView(axisView);

        axisView = new ScaleAxisView(this.registry, CanvasAxis.Z);
        axisView.setContainerView(parentView);
        parentView.addContainedView(axisView);
    }
}


export interface ArrowBounds {
    [axis: string]: Rectangle;
}
export class ScaleAxisView extends ContainedView {
    readonly id: string;
    viewType = ScaleAxisViewType;
    point: Point;
    readonly axis: CanvasAxis;
    readonly containerView: View;

    constructor(registry: Registry, axis: CanvasAxis) {
        super();
        this.axis = axis;
        this.bounds = new Rectangle(new Point(0, 0), new Point(0, 0));
        this.renderer = new ScaleAxisViewRenderer(registry);
        this.id = `${ScaleAxisViewType}-${this.axis}`.toLowerCase();
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

    toJson(): AxisViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            parentId: this.containerView.id,
        }
    }

    fromJson(json: AxisViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}