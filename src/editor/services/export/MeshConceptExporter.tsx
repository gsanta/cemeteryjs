import { minBy, sort } from "../../../misc/geometry/utils/Functions";
import { colors } from "../../gui/styles";
import { Stores } from '../../stores/Stores';
import { Concept, ConceptType } from "../../views/canvas/models/concepts/Concept";
import { MeshConcept } from "../../views/canvas/models/concepts/MeshConcept";
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");

export class MeshConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        const meshGroups = this.getSortedMeshViews().map(item => this.renderGroup(item, hover, unhover));

        return meshGroups.length > 0 ? <g data-concept-type={ConceptType.MeshConcept}>{meshGroups}</g> : null;
    }

    private getSortedMeshViews() {
        let items = [...this.getStores().canvasStore.getMeshConcepts()];
        return sort(items, (a, b) => a.layer - b.layer);
    }

    private renderGroup(item: MeshConcept, hover?: (view: Concept) => void, unhover?: (view: Concept) => void) {
        const minX = minBy<MeshConcept>(this.getStores().canvasStore.getMeshConcepts(), (a, b) => a.dimensions.topLeft.x - b.dimensions.topLeft.x).dimensions.topLeft.x;
        const minY = minBy<MeshConcept>(this.getStores().canvasStore.getMeshConcepts(), (a, b) => a.dimensions.topLeft.y - b.dimensions.topLeft.y).dimensions.topLeft.y;

        const tranlateX = minX < 0 ? - minX : 0;
        const tranlateY = minY < 0 ? - minY : 0;

        return (
            <g
                key={item.id}
                transform={`translate(${item.dimensions.topLeft.x} ${item.dimensions.topLeft.y})`}
                onMouseOver={() => hover ? hover(item) : () => undefined}
                onMouseOut={() => unhover ? unhover(item) : () => undefined}
                data-wg-x={item.dimensions.topLeft.x}
                data-wg-y={item.dimensions.topLeft.y}
                data-wg-width={item.dimensions.getWidth()}
                data-wg-height={item.dimensions.getHeight()}
                data-wg-type={item.type}
                data-wg-color={item.color}
                data-wg-layer={item.layer}
                data-rotation={item.rotation}
                data-wg-scale={item.scale}
                data-wg-name={item.id}
                data-model={item.modelPath}
                data-texture={item.texturePath}
                data-thumbnail={item.thumbnailPath}
                data-path={item.path}
                data-is-manual-control={item.isManualControl ? 'true' : 'false'}
                data-animation={item.activeAnimation}
                data-animation-id={item.animationId}
            >
                {this.renderRect(item)}
                {this.renderThumbnail(item)}
            </g>
        )
    }

    private renderRect(item: MeshConcept) {
        const stroke = this.getStores().selectionStore.contains(item) || this.getStores().hoverStore.contains(item) ? colors.views.highlight : 'black';

        return (
            <rect
                key={item.id}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
                fill={item.color}
                stroke={stroke}
            />
        );
    }

    private renderThumbnail(item: MeshConcept) {
        let thumbnail: JSX.Element = null;

        if (item.thumbnailPath) {
            thumbnail = (
                <image xlinkHref={`assets/models/${this.getFolderNameFromFileName(item.thumbnailPath)}/${item.thumbnailPath}`} x="0" y="0" height={`${item.dimensions.getHeight()}px`} width={`${item.dimensions.getWidth()}px`} />
            )
        }

        return thumbnail;
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}