import { minBy, sort } from "../../../misc/geometry/utils/Functions";
import { colors } from "../../gui/styles";
import { IViewExporter } from "../../windows/canvas/tools/IToolExporter";
import React = require("react");
import { ViewType, View } from "../../windows/canvas/models/views/View";
import { MeshView } from "../../windows/canvas/models/views/MeshView";
import { CanvasItemTag } from "../../windows/canvas/models/CanvasItem";
import { Stores } from '../../stores/Stores';

export class RectangleExporter implements IViewExporter {
    type = ViewType.GameObject;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (view: View) => void, unhover?: (view: View) => void): JSX.Element {
        const meshGroups = this.getSortedMeshViews().map(item => this.renderGroup(item, hover, unhover));

        return meshGroups.length > 0 ? <g data-view-type={ViewType.GameObject}>{meshGroups}</g> : null;
    }

    private getSortedMeshViews() {
        const viewStore = this.getStores().viewStore;
        let items = [...viewStore.getGameObjects()];
        return sort(items, (a, b) => a.layer - b.layer);
    }

    private renderGroup(item: MeshView, hover?: (view: View) => void, unhover?: (view: View) => void) {
        const minX = minBy<MeshView>(this.getStores().viewStore.getGameObjects(), (a, b) => a.dimensions.topLeft.x - b.dimensions.topLeft.x).dimensions.topLeft.x;
        const minY = minBy<MeshView>(this.getStores().viewStore.getGameObjects(), (a, b) => a.dimensions.topLeft.y - b.dimensions.topLeft.y).dimensions.topLeft.y;

        const tranlateX = minX < 0 ? - minX : 0;
        const tranlateY = minY < 0 ? - minY : 0;

        return (
            <g 
                transform={`translate(${item.dimensions.topLeft.x} ${item.dimensions.topLeft.y})`}
                onMouseOver={() => hover ? hover(item) : () => undefined}
                onMouseOut={() => unhover ? unhover(item) : () => undefined}
                data-wg-x={item.dimensions.topLeft.x + tranlateX}
                data-wg-y={item.dimensions.topLeft.y + tranlateY}
                data-wg-width={item.dimensions.getWidth()}
                data-wg-height={item.dimensions.getHeight()}
                data-wg-type={item.type}
                data-wg-color={item.color}
                data-wg-layer={item.layer}
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
                {this.renderRect(item)}
                {this.renderThumbnail(item)}
            </g>
        )
    }

    private renderRect(item: MeshView) {
        const viewStore = this.getStores().viewStore;

        const stroke = viewStore.getTags(item).has(CanvasItemTag.SELECTED) || viewStore.getTags(item).has(CanvasItemTag.HOVERED) ? colors.views.highlight : 'black';

        return (
            <rect
                key={item.name}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
                fill={item.color}
                stroke={stroke}
            />
        );
    }

    private renderThumbnail(item: MeshView) {
        let thumbnail: JSX.Element = null;
            
        if (item.thumbnailPath) {
            thumbnail =  (
                <image xlinkHref={`assets/models/${this.getFolderNameFromFileName(item.thumbnailPath)}/${item.thumbnailPath}`} x="0" y="0" height={`${item.dimensions.getHeight()}px`} width={`${item.dimensions.getWidth()}px`}/>
            )
        }

        return thumbnail;
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}