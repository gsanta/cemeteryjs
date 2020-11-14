import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { IObj } from "../../../../../core/models/objs/IObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { ChildView } from "../../../../../core/models/views/child_views/ChildView";
import { View, ViewFactory, ViewFactoryAdapter, ViewJson } from "../../../../../core/models/views/View";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MoveAxisViewRenderer } from "./MoveAxisViewRenderer";
import { ScaleAxisView, ScaleAxisViewType } from "./ScaleAxisView";

export interface AxisViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const MoveAxisViewType = 'move-axis-view';

export class MoveAxisViewFactory extends ViewFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new MoveAxisView(this.registry);
    }

    instantiateOnSelection(parentView: View) {
        let scaleView = <ScaleAxisView> this.registry.data.view.scene.getViewFactory(ScaleAxisViewType).instantiate();
        scaleView.axis = CanvasAxis.X;
        scaleView.setParent(parentView);
        parentView.addChild(scaleView);

        scaleView = <ScaleAxisView> this.registry.data.view.scene.getViewFactory(ScaleAxisViewType).instantiate();
        scaleView.axis = CanvasAxis.Y;
        scaleView.setParent(parentView);
        parentView.addChild(scaleView);

        scaleView = <ScaleAxisView> this.registry.data.view.scene.getViewFactory(ScaleAxisViewType).instantiate();
        scaleView.axis = CanvasAxis.Z;
        scaleView.setParent(parentView);
        parentView.addChild(scaleView);
    }
}

export class MoveAxisView extends ChildView {
    id: string;
    axis: CanvasAxis;
    viewType = MoveAxisViewType;
    point: Point;
    readonly parent: View;

    constructor(registry: Registry) {
        super();
        this.bounds = new Rectangle(new Point(0, 0), new Point(0, 0));

        this.renderer = new MoveAxisViewRenderer(registry);
    }

    getObj(): IObj {
        return this.parent.getObj();
    }

    setObj(obj: PathObj) {
        this.parent.setObj(obj);
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
        const center = this.parent.getBounds().getBoundingCenter();
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
            parentId: this.parent.id,
        }
    }

    fromJson(json: AxisViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}