import { AxisToolId } from "../../../../plugins/canvas_plugins/scene_editor/tools/AxisTool";
import { LineSegment } from "../../../../utils/geometry/shapes/LineSegment";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPlugin } from "../../../plugin/AbstractCanvasPlugin";
import { Registry } from "../../../Registry";
import { UI_SvgGroup } from "../../../ui_components/elements/svg/UI_SvgGroup";
import { UI_SvgCanvas } from "../../../ui_components/elements/UI_SvgCanvas";
import { CanvasAxis } from "../../misc/CanvasAxis";
import { IObj } from "../../objs/IObj";
import { PathObj } from "../../objs/PathObj";
import { View, ViewFactory, ViewJson, ViewRenderer } from "../View";
import { ChildView } from "./ChildView";
import { ScaleView } from "./ScaleView";
import { UI_Plugin } from '../../../plugin/UI_Plugin';

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

    createRenderer(registry: Registry) {
        return new AxisViewRenderer(registry);
    }
}

const arrowLength = 50;
const diagonalArrowLength = arrowLength / Math.sqrt(2);

// TODO: merge together the duplicate code with ScaleView
export class AxisViewRenderer implements ViewRenderer {
    private registry: Registry;

    private colors: {[CanvasAxis.X]: string, [CanvasAxis.Y]: string, [CanvasAxis.Z]: string} = {
        [CanvasAxis.X]: undefined,
        [CanvasAxis.Y]: undefined,
        [CanvasAxis.Z]: undefined,
    }

    private lineBounds: { [axis: string]: LineSegment } = {
        [CanvasAxis.X]: new LineSegment(new Point(0, 0), new Point(arrowLength, 0)),
        [CanvasAxis.Y]: new LineSegment(new Point(0, 0), new Point(diagonalArrowLength, -diagonalArrowLength)),
        [CanvasAxis.Z]: new LineSegment(new Point(0, 0), new Point(0, -arrowLength))
    }

    constructor(registry: Registry) {
        this.registry = registry;

        this.colors[CanvasAxis.X] = this.registry.preferences.colors.red;
        this.colors[CanvasAxis.Y] = this.registry.preferences.colors.green;
        this.colors[CanvasAxis.Z] = this.registry.preferences.colors.blue;
    }

    renderInto(canvas: UI_SvgCanvas, axisView: AxisView, plugin: UI_Plugin) {
        if (!plugin.getToolController().getToolById(AxisToolId).isSelected) {
            return null;
        }

        const group = canvas.group(axisView.id);
        group.isInteractive = false;

        this.renderArrowLine(group, axisView);
        this.renderArrowHead(group, axisView);
        this.renderHighlightLine(group, axisView, plugin);
    }

    private renderHighlightLine(group: UI_SvgGroup, axisView: AxisView, plugin: UI_Plugin) {
        const center = axisView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            stroke: 'transparent',
            strokeWidth: "6"
        }

        line.data = axisView;
        line.controller = () => plugin.toolController(axisView, AxisToolId)
        line.isInteractive = true;

        const x1 = center.x + this.lineBounds[axisView.axis].point1.x;
        const y1 = center.y + this.lineBounds[axisView.axis].point1.y;
        const x2 = center.x + this.lineBounds[axisView.axis].point2.x;
        const y2 = center.y + this.lineBounds[axisView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowLine(group: UI_SvgGroup, axisView: ScaleView) {
        const center = axisView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.markerEnd = `url(#${axisView.axis})`;
        line.css = {
            stroke: this.colors[axisView.axis],
            strokeWidth: "3"
        }

        const x1 = center.x + this.lineBounds[axisView.axis].point1.x;
        const y1 = center.y + this.lineBounds[axisView.axis].point1.y;
        const x2 = center.x + this.lineBounds[axisView.axis].point2.x;
        const y2 = center.y + this.lineBounds[axisView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowHead(group: UI_SvgGroup, axisView: ScaleView) {
        const marker = group.marker({});
        marker.id = axisView.axis;
        marker.refX = 5;
        marker.refY = 5;
        marker.markerWidth = 5;
        marker.markerHeight = 5;
        marker.viewBox = "0 0 10 10";

        const path = marker.path();
        path.d = "M 0 0 L 10 5 L 0 10 z";

        path.css = {
            fill: this.colors[axisView.axis]
        }
    }
}


export class AxisView extends ChildView {
    id: string;
    axis: CanvasAxis;
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