import { ScaleToolId } from "../../../../plugins/canvas_plugins/scene_editor/tools/ScaleTool";
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
import { UI_Plugin } from '../../../plugin/UI_Plugin';

export interface AxisViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const ScaleViewType = 'scale-view';

export class ScaleViewFactory implements ViewFactory {
    viewType = ScaleViewType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    newInstance() { return new ScaleView(); }

    createRenderer(registry: Registry) {
        return new ScaleViewRenderer(registry);
    }
}

const arrowLength = 50;
const diagonalArrowLength = arrowLength / Math.sqrt(2);

export interface ArrowBounds {
    [axis: string]: Rectangle;
}

class ScaleViewRenderer implements ViewRenderer {
    private registry: Registry;

    static readonly arrowLength = 50;

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

    renderInto(canvas: UI_SvgCanvas, scaleView: ScaleView, plugin: UI_Plugin) {
        if (!plugin.getToolController().getToolById(ScaleToolId).isSelected) {
            return null;
        }

        const group = canvas.group(scaleView.id);
        group.isInteractive = false;

        this.renderBoundingRect(group, scaleView, plugin);
        this.renderArrowLine(group, scaleView);
        this.renderArrowHead(group, scaleView);
    }

    private renderBoundingRect(group: UI_SvgGroup, scaleView: ScaleView, plugin: UI_Plugin) {
        const center = scaleView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            stroke: 'transparent',
            strokeWidth: "6"
        }

        line.data = scaleView;
        line.controller = () => plugin.toolController(scaleView, ScaleToolId)
        line.isInteractive = true;

        const x1 = center.x + this.lineBounds[scaleView.axis].point1.x;
        const y1 = center.y + this.lineBounds[scaleView.axis].point1.y;
        const x2 = center.x + this.lineBounds[scaleView.axis].point2.x;
        const y2 = center.y + this.lineBounds[scaleView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowLine(group: UI_SvgGroup, scaleView: ScaleView) {
        const center = scaleView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.markerEnd = `url(#${scaleView.viewType}-${scaleView.axis})`;
        line.css = {
            pointerEvents: 'none',
            stroke: this.colors[scaleView.axis],
            strokeWidth: "3"
        }

        const x1 = center.x + this.lineBounds[scaleView.axis].point1.x;
        const y1 = center.y + this.lineBounds[scaleView.axis].point1.y;
        const x2 = center.x + this.lineBounds[scaleView.axis].point2.x;
        const y2 = center.y + this.lineBounds[scaleView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowHead(group: UI_SvgGroup, scaleView: ScaleView) {
        const marker = group.marker({});
        marker.refX = 5;
        marker.refY = 5;
        marker.markerWidth = 5;
        marker.markerHeight = 5;
        marker.viewBox = "0 0 10 10";
        marker.id = `${scaleView.viewType}-${scaleView.axis}`;

        const path = marker.path();
        path.d = "M 0 0 L 10 0 L 10 10 L 0 10 z";

        path.css = {
            fill: this.colors[scaleView.axis]
        }
    }
}

export class ScaleView extends ChildView {
    id: string;
    viewType = ScaleViewType;
    point: Point;
    axis: CanvasAxis;
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