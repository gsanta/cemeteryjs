import { Stores } from '../../stores/Stores';
import { ConceptType } from "../../views/canvas/models/concepts/Concept";
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");

export class ModelConceptExporter implements IConceptExporter {
    type = ConceptType.ModelConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(): JSX.Element {
        const models = this.getStores().canvasStore.getModelConcepts().map(model => {
            return <g
                key={model.id}
                data-id={model.id}
                data-model-path={model.modelPath}
                data-texture-path={model.texturePath}
                data-thumbnail-path={model.thumbnailPath}
            />
        });

        return models.length > 0 ? 
            (
                <g data-concept-type={ConceptType.ModelConcept} key={ConceptType.ModelConcept}>{models}</g> 
            )
            : null;
    }
}