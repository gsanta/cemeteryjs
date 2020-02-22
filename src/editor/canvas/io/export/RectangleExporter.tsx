import { MeshView } from "../../models/views/MeshView";
import { ViewType } from "../../models/views/View";
import { Point } from "../../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../../misc/geometry/shapes/Rectangle";
import { minBy, sort } from "../../../../misc/geometry/utils/Functions";
import { colors } from "../../../gui/styles";
import { CanvasItemTag } from "../../models/CanvasItem";
import { IViewExporter } from "../../tools/IToolExporter";
import React = require("react");
import { CanvasController } from "../../CanvasController";

export class RectangleExporter implements IViewExporter {
    type = ViewType.GameObject;
    private controller: CanvasController;

    constructor(controller: CanvasController) {
        this.controller = controller;
    }

    export(): JSX.Element {
        const rectangles = this.renderRectangles();
        return rectangles.length > 0 ? <g data-view-type={ViewType.GameObject}>{rectangles}</g> : null;
    }

    private renderRectangles(): JSX.Element[] {
        const canvasStore = this.controller.viewStore;
        let items = [...this.controller.viewStore.getGameObjects()];
        items = sort(items, (a, b) => canvasStore.getLayer(a) - canvasStore.getLayer(b));

        return items.map((item, i) => {
            const rectangle = item.dimensions as Rectangle;
            
            return this.renderGroup(item, rectangle, [this.renderRect(item, rectangle, i + ''), this.renderThumbnail(item, rectangle)]);
        });
    }

    private renderGroup(item: MeshView, dimensions: Rectangle, children: JSX.Element[]) {
        const minX = minBy<MeshView>(this.controller.viewStore.getGameObjects(), (a, b) => a.dimensions.topLeft.x - b.dimensions.topLeft.x).dimensions.topLeft.x;
        const minY = minBy<MeshView>(this.controller.viewStore.getGameObjects(), (a, b) => a.dimensions.topLeft.y - b.dimensions.topLeft.y).dimensions.topLeft.y;

        const tranlateX = minX < 0 ? - minX : 0;
        const tranlateY = minY < 0 ? - minY : 0;

        return (
            <g 
                transform={`translate(${dimensions.topLeft.x} ${dimensions.topLeft.y})`}
                onMouseOver={() => this.controller.mouseController.hover(item)}
                onMouseOut={() => this.controller.mouseController.unhover(item)}
                data-wg-x={dimensions.topLeft.x + tranlateX}
                data-wg-y={dimensions.topLeft.y + tranlateY}
                data-wg-width={dimensions.getWidth()}
                data-wg-height={dimensions.getHeight()}
                data-wg-type={item.type}
                data-wg-color={item.color}
                data-wg-layer={this.controller.viewStore.getLayer(item)}
                data-rotation={item.rotation}
                data-wg-scale={item.scale}
                data-wg-name={item.name}
                data-model={item.modelPath}
                data-texture={item.texturePath}
                data-thumbnail={item.thumbnailPath}
                data-path={item.path}
                data-is-manual-control={item.isManualControl ? 'true' : 'false'}
                data-animation={item.activeAnimation}
            >
                {children}
            </g>
        )
    }

    private renderRect(item: MeshView, dimensions: Rectangle, key: string) {
        const canvasStore = this.controller.viewStore;

        const stroke = canvasStore.getTags(item).has(CanvasItemTag.SELECTED) || canvasStore.getTags(item).has(CanvasItemTag.HOVERED) ? colors.views.highlight : 'black';

        return (
            <rect
                key={key}
                x={`0`}
                y={`0`}
                width={`${dimensions.getWidth()}px`}
                height={`${dimensions.getHeight()}px`}
                fill={item.color}
                stroke={stroke}
            />
        );
    }

    private renderThumbnail(item: MeshView, dimensions: Rectangle) {
        let thumbnail: JSX.Element = null;
            
        if (item.thumbnailPath) {
            thumbnail =  (
                <image xlinkHref={`assets/models/${this.getFolderNameFromFileName(item.thumbnailPath)}/${item.thumbnailPath}`} x="0" y="0" height={`${dimensions.getHeight()}px`} width={`${dimensions.getWidth()}px`}/>
            )
        }

        return thumbnail;
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}