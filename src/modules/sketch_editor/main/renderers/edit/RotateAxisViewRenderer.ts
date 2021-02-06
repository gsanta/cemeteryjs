
import { AbstractShape, ShapeRenderer } from "../../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { UI_SvgGroup } from "../../../../../core/ui_components/elements/svg/UI_SvgGroup";
import { UI_SvgCanvas } from "../../../../../core/ui_components/elements/UI_SvgCanvas";
import { RotateAxisToolId } from "../../controllers/tools/RotateAxisTool";
import { axisLineBounds, getAxisColor } from "../../models/shapes/edit/axisUtils";
import { RotateAxisView, RotateAxisShapeType } from "../../models/shapes/edit/RotateAxisShape";

export class RotateAxisViewRenderer implements ShapeRenderer {
    id = RotateAxisShapeType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(canvas: UI_SvgCanvas, axisView: RotateAxisView, canvasPanel: AbstractCanvasPanel<AbstractShape>) {
        if (!canvasPanel.tool.getToolById(RotateAxisToolId).isSelected) {
            return null;
        }

        const group = canvas.group(axisView.id);
        group.isInteractive = false;

        this.renderBoundingRect(group, axisView);
        this.renderArrowLine(group, axisView);
        this.renderArrowHead(group, axisView);
    }

    private renderBoundingRect(group: UI_SvgGroup, axisView: RotateAxisView) {
        const center = axisView.containerShape.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            stroke: 'transparent',
            strokeWidth: "6"
        }

        line.data = axisView;
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

    private renderArrowLine(group: UI_SvgGroup, axisView: RotateAxisView) {
        const center = axisView.containerShape.getBounds().getBoundingCenter();
        
        const line = group.line();
        line.css = {
            pointerEvents: 'none',
            stroke: getAxisColor(axisView.axis, this.registry),
            strokeWidth: "3",
            markerEnd: `url(#${RotateAxisToolId}-${axisView.axis})`
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

    private renderArrowHead(group: UI_SvgGroup, axisView: RotateAxisView) {
        const marker = group.marker({key: `${RotateAxisToolId}-${axisView.axis}`, uniqueId: `${RotateAxisToolId}-${axisView.axis}`});
        marker.refX = 5;
        marker.refY = 5;
        marker.markerWidth = 5;
        marker.markerHeight = 5;
        marker.viewBox = "0 0 10 10";

        const path = marker.path();
        path.d = "M 0 0 A 1 1 0 0 1 0 10";

        path.css = {
            fill: getAxisColor(axisView.axis, this.registry),
        }
    }
}