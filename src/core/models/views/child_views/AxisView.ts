import { AxisToolId } from "../../../../plugins/canvas_plugins/scene_editor/tools/AxisTool";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { UI_SvgCanvas } from "../../../ui_components/elements/UI_SvgCanvas";
import { IObj } from "../../objs/IObj";
import { PathObj } from "../../objs/PathObj";
import { View, ViewFactory, ViewJson } from "../View";
import { ChildView } from "./ChildView";

export interface AxisViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const AxisViewType = 'axis-view';

export class AxisViewFactory implements ViewFactory {
    viewType = AxisViewType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    newInstance() { return new AxisView(); }

    renderInto(canvas: UI_SvgCanvas, axisView: AxisView) {
        const group = canvas.group(`y-control`);
        group.data = axisView;
        group.scopedToolId = AxisToolId;
        group.isInteractive = true;

        const center = axisView.getBounds().getBoundingCenter();
        const topLeft = axisView.getBounds().topLeft; 
        const botRight = axisView.getBounds().bottomRight; 

        const rect = group.rect();
        rect.x = topLeft.x;
        rect.y = topLeft.y;
        rect.width = axisView.getBounds().getWidth();
        rect.height = axisView.getBounds().getHeight();
        rect.css = {
            opacity: 0,
            fill: 'white',
            strokeWidth: '0'
        }

        const line = group.line();
        line.css = {
            pointerEvents: 'none',
            stroke: this.registry.preferences.colors.green,
            strokeWidth: "3"
        }

        line.x1 = center.x;
        line.y1 = axisView.getBounds().topLeft.y + 10;
        line.x2 = center.x;
        line.y2 = axisView.getBounds().bottomRight.y;

        const polygon = group.polygon();
        polygon.points = `${topLeft.x},${topLeft.y + 15} ${botRight.x},${topLeft.y + 15} ${center.x},${topLeft.y}`;
        polygon.css = {
            fill: this.registry.preferences.colors.green
        }
    }
}


export class AxisView extends ChildView {
    id: string;
    viewType = AxisViewType;
    point: Point;
    readonly parent: View;

    constructor() {
        super();
        this.bounds = new Rectangle(new Point(0, 0), new Point(0, 0));
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