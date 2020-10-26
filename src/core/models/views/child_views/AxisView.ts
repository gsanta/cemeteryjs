import { AxisToolId } from "../../../../plugins/canvas_plugins/scene_editor/tools/AxisTool";
import { LineSegment } from "../../../../utils/geometry/shapes/LineSegment";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPlugin } from "../../../plugin/AbstractCanvasPlugin";
import { Registry } from "../../../Registry";
import { UI_SvgGroup } from "../../../ui_components/elements/svg/UI_SvgGroup";
import { UI_Container } from "../../../ui_components/elements/UI_Container";
import { UI_SvgCanvas } from "../../../ui_components/elements/UI_SvgCanvas";
import { CanvasAxis } from "../../misc/CanvasAxis";
import { IObj } from "../../objs/IObj";
import { PathObj } from "../../objs/PathObj";
import { View, ViewFactory, ViewJson, ViewRenderer } from "../View";
import { ChildView } from "./ChildView";
import { ArrowBounds, ScaleView } from "./ScaleView";

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
const diagonalArrowLength = Math.sqrt(2) * arrowLength;

export class AxisViewRenderer implements ViewRenderer {
    private registry: Registry;

    private colors: {[CanvasAxis.X]: string, [CanvasAxis.Y]: string, [CanvasAxis.Z]: string} = {
        [CanvasAxis.X]: undefined,
        [CanvasAxis.Y]: undefined,
        [CanvasAxis.Z]: undefined,
    }

    private lineBounds: { [axis: string]: LineSegment } = {
        [CanvasAxis.X]: new LineSegment(new Point(0, 0), new Point(arrowLength, 0)),
        [CanvasAxis.Y]: new LineSegment(new Point(0, -arrowLength), new Point(0, 0)),
        [CanvasAxis.Z]: new LineSegment(new Point(0, -arrowLength), new Point(0, 0))
    }

    private arrowHeadBounds: { [axis: string]: {p1: Point, p2: Point, p3: Point} } = {
        [CanvasAxis.X]: { p1: new Point(arrowLength, -7), p2: new Point(arrowLength + 14, 0), p3: new Point(arrowLength, 7)},
        [CanvasAxis.Z]: { p1: new Point(-7, -arrowLength), p2: new Point(0, -arrowLength - 14), p3: new Point(7, -arrowLength)},
    }

    private arrowBounds: ArrowBounds = {
        [CanvasAxis.X]: new Rectangle(new Point(0, -7), new Point(arrowLength + 14, 7)),
        [CanvasAxis.Z]: new Rectangle(new Point(-7, - arrowLength - 14), new Point(7, 0))
    }

    constructor(registry: Registry) {
        this.registry = registry;

        this.colors[CanvasAxis.X] = this.registry.preferences.colors.red;
        this.colors[CanvasAxis.Z] = this.registry.preferences.colors.blue;
    }

    renderInto(canvas: UI_SvgCanvas, axisView: AxisView, plugin: AbstractCanvasPlugin) {
        if (!plugin.getToolController().getToolById(AxisToolId).isSelected) {
            return null;
        }

        const group = canvas.group(axisView.id)
        group.data = axisView;
        group.controller = () => plugin.toolController(axisView, AxisToolId)
        group.isInteractive = true;

        this.renderBoundingRect(group, axisView);
        this.renderArrowLine(group, axisView);
        this.renderArrowHead(group, axisView);
    }

    private renderBoundingRect(group: UI_SvgGroup, axisView: AxisView) {
        const center = axisView.parent.getBounds().getBoundingCenter();

        const x1 = center.x + this.arrowBounds[axisView.axis].topLeft.x;
        const y1 = center.y + this.arrowBounds[axisView.axis].topLeft.y;
        const x2 = center.x + this.arrowBounds[axisView.axis].bottomRight.x;
        const y2 = center.y + this.arrowBounds[axisView.axis].bottomRight.y;

        const rect = group.rect();
        rect.x = x1;
        rect.y = y1;
        rect.width = x2 - x1;
        rect.height = y2 - y1;
        rect.css = {
            opacity: 0,
            fill: 'white',
            strokeWidth: '0'
        }
    }

    private renderArrowLine(group: UI_SvgGroup, scaleView: ScaleView) {
        const center = scaleView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
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
        const center = scaleView.parent.getBounds().getBoundingCenter();
        const polygon = group.polygon();

        const x1 = center.x + this.arrowHeadBounds[scaleView.axis].p1.x;
        const y1 = center.y + this.arrowHeadBounds[scaleView.axis].p1.y;
        const x2 = center.x + this.arrowHeadBounds[scaleView.axis].p2.x;
        const y2 = center.y + this.arrowHeadBounds[scaleView.axis].p2.y;
        const x3 = center.x + this.arrowHeadBounds[scaleView.axis].p3.x;
        const y3 = center.y + this.arrowHeadBounds[scaleView.axis].p3.y;

        polygon.points = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x1},${y1}`;
        polygon.css = {
            fill: this.colors[scaleView.axis]
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