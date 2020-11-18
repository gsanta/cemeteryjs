import { ViewRenderer } from "../../../../../core/models/views/View";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { UI_SvgGroup } from "../../../../../core/ui_components/elements/svg/UI_SvgGroup";
import { UI_SvgCanvas } from "../../../../../core/ui_components/elements/UI_SvgCanvas";
import { ScaleAxisToolId } from "../tools/ScaleAxisTool";
import { axisLineBounds, getAxisColor } from "./axisUtils";
import { ScaleAxisViewType, ScaleAxisView } from "./ScaleAxisView";

export class ScaleAxisViewRenderer implements ViewRenderer {
    id = ScaleAxisViewType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    renderInto(canvas: UI_SvgCanvas, scaleView: ScaleAxisView, canvasPanel: AbstractCanvasPanel): void {
        if (!canvasPanel.toolController.getToolById(ScaleAxisToolId).isSelected) {
            return null;
        }

        const group = canvas.group(scaleView.id);
        group.isInteractive = false;

        this.renderBoundingRect(group, scaleView);
        this.renderArrowLine(group, scaleView);
        this.renderArrowHead(group, scaleView);
    }

    private renderBoundingRect(group: UI_SvgGroup, scaleView: ScaleAxisView) {
        const center = scaleView.containerView.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            stroke: 'transparent',
            strokeWidth: "6"
        }

        line.data = scaleView;
        // line.controller = () => plugin.toolController(scaleView, ScaleToolId)
        line.scopedToolId = ScaleAxisToolId;
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

    private renderArrowLine(group: UI_SvgGroup, scaleView: ScaleAxisView) {
        const center = scaleView.containerView.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.markerEnd = `url(#${scaleView.viewType}-${scaleView.axis})`;
        line.css = {
            pointerEvents: 'none',
            stroke: getAxisColor(scaleView.axis, this.registry),
            strokeWidth: "3"
        }

        const x1 = center.x + axisLineBounds[scaleView.axis].point1.x;
        const y1 = center.y + axisLineBounds[scaleView.axis].point1.y;
        const x2 = center.x + axisLineBounds[scaleView.axis].point2.x;
        const y2 = center.y + axisLineBounds[scaleView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowHead(group: UI_SvgGroup, scaleView: ScaleAxisView) {
        const marker = group.marker({key: `${scaleView.viewType}-${scaleView.axis}`, uniqueId: `${scaleView.viewType}-${scaleView.axis}`});
        marker.refX = 5;
        marker.refY = 5;
        marker.markerWidth = 5;
        marker.markerHeight = 5;
        marker.viewBox = "0 0 10 10";

        const path = marker.path();
        path.d = "M 0 0 L 10 0 L 10 10 L 0 10 z";

        path.css = {
            fill: getAxisColor(scaleView.axis, this.registry)
        }
    }
}