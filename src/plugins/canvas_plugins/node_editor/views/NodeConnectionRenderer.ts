import { ViewTag } from "../../../../core/models/views/View";
import { IRenderer } from "../../../../core/plugin/IRenderer";
import { Registry } from "../../../../core/Registry";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeConnectionView, NodeConnectionViewType } from "./NodeConnectionView";


export class NodeConnectionRenderer implements IRenderer<UI_SvgCanvas> {
    private registry: Registry;
    private arrowRedRenderer: ArrowRenderer;
    private arrowGreenRenderer: ArrowRenderer;

    constructor(registry: Registry) {
        this.registry = registry;
        this.arrowRedRenderer = new ArrowRenderer(colors.nodes.connectionRed);
        this.arrowGreenRenderer = new ArrowRenderer(colors.nodes.connectionGreen);
    }

    renderInto(svgCanvas: UI_SvgCanvas): void {
        this.arrowRedRenderer.renderInto(svgCanvas);
        this.arrowGreenRenderer.renderInto(svgCanvas);
        this.renderConnectionsInto(svgCanvas);
    }

    private renderConnectionsInto(canvas: UI_SvgCanvas) {
        this.registry.data.view.node.getViewsByType(NodeConnectionViewType).forEach((connection: NodeConnectionView) => {
            const pathCss = {
                pointerEvents: 'none' as 'none',
                stroke: connection.color,
                strokeWidth: "3",
                markerMid: `url(#node-connection-marker-${connection.color})`
            };

            const startP = connection.outputPoint;
            const endP = connection.inputPoint;
            const centerP = new Point((startP.x + endP.x) / 2, (startP.y + endP.y) / 2);

            const pathFirstHalf = canvas.path();
            pathFirstHalf.d = `M ${startP.x} ${startP.y} L ${centerP.x} ${centerP.y} L ${endP.x} ${endP.y}`;
            pathFirstHalf.css = pathCss;

            const line2 = canvas.line();
            line2.data = connection;
            line2.css = {
                stroke: connection.tags.has(ViewTag.Hovered) || connection.tags.has(ViewTag.Selected) ? colors.views.highlight : 'transparent',
                strokeWidth: "6"
            }
            line2.x1 = connection.outputPoint.x;
            line2.y1 = connection.outputPoint.y;
            line2.x2 = connection.inputPoint.x;
            line2.y2 = connection.inputPoint.y;
        });
    }
}

class ArrowRenderer implements IRenderer<UI_SvgCanvas> {
    private color: string;

    constructor(color: string) {
        this.color = color;
    }

    renderInto(svgCanvas: UI_SvgCanvas): void {
        const marker = svgCanvas.marker({key: `node-connection-marker-${this.color}`, uniqueId: `node-connection-marker-${this.color}`});

        marker.refX = 5;
        marker.refY = 5;
        marker.markerWidth = 5;
        marker.markerHeight = 5;
        marker.viewBox = "0 0 10 10";

        const path = marker.path();
        path.d = "M 0 0 L 10 5 L 0 10 z";

        path.css = {
            fill: this.color
        }
    }
}