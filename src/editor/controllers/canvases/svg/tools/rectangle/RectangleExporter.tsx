import { SvgCanvasController } from "../../SvgCanvasController";
import React = require("react");
import { sort, minBy } from "../../../../../../model/geometry/utils/Functions";
import { Rectangle } from "../../../../../../model/geometry/shapes/Rectangle";
import { CanvasItemTag, CanvasRect } from "../../models/CanvasItem";
import { ToolType } from "../Tool";
import { IToolExporter } from "../IToolExporter";

export class RectangleExporter implements IToolExporter {
    type = ToolType.RECTANGLE;
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
    }

    export(): JSX.Element {
        return <g data-tool-type={ToolType.RECTANGLE}>{this.renderRectangles()}</g>;
    }

    private renderRectangles(): JSX.Element[] {
        const pixelModel = this.canvasController.canvasStore;
        const configModel = this.canvasController.configModel;
        const pixelSize = configModel.pixelSize;

        let items = [...this.canvasController.canvasStore.items];
        items = sort(items, (a, b) => a.layer - b.layer);
        return items.map((item, i) => {
            const rectangle = item.dimensions as Rectangle;

            const x = rectangle.topLeft.x * pixelSize;
            const y = rectangle.topLeft.y * pixelSize;
            const width = (rectangle.bottomRight.x - rectangle.topLeft.x) * pixelSize;
            const height = (rectangle.bottomRight.y - rectangle.topLeft.y) * pixelSize;

            const fill = item.tags.has(CanvasItemTag.SELECTED) ? 'blue' : item.color;

            const minX = minBy<CanvasRect>(pixelModel.items, (a, b) => a.dimensions.topLeft.x - b.dimensions.topLeft.x).dimensions.topLeft.x;
            const minY = minBy<CanvasRect>(pixelModel.items, (a, b) => a.dimensions.topLeft.y - b.dimensions.topLeft.y).dimensions.topLeft.y;
            

            const tranlateX = minX < 0 ? - minX * pixelSize : 0;
            const tranlateY = minY < 0 ? - minY * pixelSize : 0;

            return (
                <rect
                    key={i}
                    x={`${x}px`}
                    y={`${y}px`}
                    width={`${width}px`}
                    height={`${height}px`}
                    fill={fill}
                    stroke='black'
                    onMouseOver={() => this.canvasController.mouseController.hover(item)}
                    onMouseOut={() => this.canvasController.mouseController.unhover()}

                    data-wg-x={x + tranlateX}
                    data-wg-y={y + tranlateY}
                    data-wg-width={width}
                    data-wg-height={height}
                    data-wg-type={item.type}
                    data-wg-color={item.color}
                    data-wg-layer={item.layer}
                    data-rotation={item.rotation}
                    data-wg-shape={item.shape}
                    data-wg-scale={item.scale}
                    data-wg-name={item.name}
                />
            )
        });
    }
}