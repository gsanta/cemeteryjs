import { ViewRenderer } from "../../../../../core/models/views/View";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { ViewPlugin } from "../../../../../core/plugin/ViewPlugin";
import { Registry } from "../../../../../core/Registry";
import { UI_SvgGroup } from "../../../../../core/ui_components/elements/svg/UI_SvgGroup";
import { UI_SvgCanvas } from "../../../../../core/ui_components/elements/UI_SvgCanvas";
import { MoveAxisToolId } from "../tools/MoveAxisTool";
import { axisLineBounds, getAxisColor } from "./axisUtils";
import { MoveAxisViewType, MoveAxisView } from "./MoveAxisView";
import { ScaleAxisView } from "./ScaleAxisView";

export class MoveAxisViewRenderer implements ViewRenderer {
    id = MoveAxisViewType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(canvas: UI_SvgCanvas, axisView: MoveAxisView, canvasPanel: AbstractCanvasPanel) {
        if (!canvasPanel.toolController.getToolById(MoveAxisToolId).isSelected) {
            return null;
        }

        const group = canvas.group(axisView.id);
        group.isInteractive = false;

        this.renderArrowLine(group, axisView);
        this.renderArrowHead(group, axisView);
        this.renderHighlightLine(group, axisView);
    }

    private renderHighlightLine(group: UI_SvgGroup, axisView: MoveAxisView) {
        const center = axisView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            stroke: 'transparent',
            strokeWidth: "6"
        }

        line.data = axisView;
        // line.controller = () => plugin.toolController(axisView, AxisToolId)
        line.scopedToolId = MoveAxisToolId;
        line.isInteractive = true;

        const x1 = center.x + axisLineBounds[axisView.axis].point1.x;
        const y1 = center.y + axisLineBounds[axisView.axis].point1.y;
        const x2 = center.x + axisLineBounds[axisView.axis].point2.x;
        const y2 = center.y + axisLineBounds[axisView.axis].point2.y;

        line.x1 = x1;
        line.y1 = y1;
        line.x2 = x2;
        line.y2 = y2;
    }

    private renderArrowLine(group: UI_SvgGroup, axisView: ScaleAxisView) {
        const center = axisView.parent.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.markerEnd = `url(#${MoveAxisToolId}-${axisView.axis})`;
        line.css = {
            stroke: getAxisColor(axisView.axis, this.registry),
            strokeWidth: "3"
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