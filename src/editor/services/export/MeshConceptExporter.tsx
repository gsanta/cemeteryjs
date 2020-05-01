import { sort } from "../../../misc/geometry/utils/Functions";
import { colors } from "../../gui/styles";
import { Stores } from '../../stores/Stores';
import { Concept, ConceptType } from "../../views/canvas/models/concepts/Concept";
import { MeshConcept } from "../../views/canvas/models/concepts/MeshConcept";
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { Registry } from "../../Registry";

export class MeshConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        const meshGroups = this.getSortedMeshViews().map(item => this.renderGroup(item, hover, unhover));

        return meshGroups.length > 0 ? <g data-concept-type={ConceptType.MeshConcept} key={ConceptType.MeshConcept}>{meshGroups}</g> : null;
    }

    private getSortedMeshViews() {
        let items = [...this.registry.stores.canvasStore.getMeshConcepts()];
        return sort(items, (a, b) => a.layer - b.layer);
    }

    private renderGroup(item: MeshConcept, hover?: (view: Concept) => void, unhover?: (view: Concept) => void) {
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
                data-model-id={item.modelId}
                data-thumbnail={item.thumbnailPath}
                data-path={item.path}
                data-is-manual-control={item.isManualControl ? 'true' : 'false'}
                data-animation-id={item.animationId}
            >
                {this.renderRect(item)}
                {this.renderThumbnail(item)}
            </g>
        )
    }

    private renderRect(item: MeshConcept) {
        const stroke = this.registry.stores.selectionStore.contains(item) || this.registry.stores.hoverStore.contains(item) ? colors.views.highlight : 'black';

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