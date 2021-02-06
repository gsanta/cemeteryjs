import { AbstractShape, ShapeRenderer } from "../../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../../core/models/modules/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { UI_SvgGroup } from "../../../../../core/ui_components/elements/svg/UI_SvgGroup";
import { UI_SvgCanvas } from "../../../../../core/ui_components/elements/UI_SvgCanvas";
import { MoveAxisShapeType, MoveAxisView } from "../../models/shapes/edit/MoveAxisShape";
import { MoveAxisToolId } from "../../controllers/tools/MoveAxisTool";
import { axisLineBounds, getAxisColor } from "../../models/shapes/edit/axisUtils";
import { ScaleAxisView } from "../../models/shapes/edit/ScaleAxisShape";

export class MoveAxisViewRenderer implements ShapeRenderer {
    id = MoveAxisShapeType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(canvas: UI_SvgCanvas, axisView: MoveAxisView, canvasPanel: AbstractCanvasPanel<AbstractShape>) {
        if (!canvasPanel.tool.getToolById(MoveAxisToolId).isSelected) {
            return null;
        }

        const group = canvas.group(axisView.id);
        group.isInteractive = false;

        this.renderBoundingRect(group, axisView);
        this.renderArrowLine(group, axisView);
        this.renderArrowHead(group, axisView);
    }

    private renderBoundingRect(group: UI_SvgGroup, scaleView: ScaleAxisView) {
        const center = scaleView.containerShape.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            stroke: 'transparent',
            strokeWidth: "6"
        }

        line.data = scaleView;
        // line.controller = () => plugin.toolController(scaleView, ScaleToolId)
        line.isInteractive = true;

        const x1 = center.x + axisLineBounds[scaleView.axis].point1.x;
        const y1 = center.y + axisLineBounds[scaleView.axis].point1.y;
        const x2 = center.x + axisLineBounds[scaleView.axis].point2.x;
        const y2 = center.y + axisLineBounds[scaleView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }
    private renderArrowLine(group: UI_SvgGroup, axisView: ScaleAxisView) {
        const center = axisView.containerShape.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            pointerEvents: 'none',
            stroke: getAxisColor(axisView.axis, this.registry),
            strokeWidth: "3",
            markerEnd: `url(#${MoveAxisToolId}-${axisView.axis})`
        }

        const x1 = center.x + axisLineBounds[axisView.axis].point1.x;
        const y1 = center.y + axisLineBounds[axisView.axis].point1.y;
        const x2 = center.x + axisLineBounds[axisView.axis].point2.x;
        const y2 = center.y + axisLineBounds[axisView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowHead(group: UI_SvgGroup, axisView: ScaleAxisView) {
        const marker = group.marker({key: `${MoveAxisToolId}-${axisView.axis}`, uniqueId: `${MoveAxisToolId}-${axisView.axis}`});
        marker.refX = 5;
        marker.refY = 5;
        marker.markerWidth = 5;
        marker.markerHeight = 5;
        marker.viewBox = "0 0 10 10";

        const path = marker.path();
        path.d = "M 0 0 L 10 5 L 0 10 z";

        path.css = {
            fill: getAxisColor(axisView.axis, this.registry)
        }
    }
}