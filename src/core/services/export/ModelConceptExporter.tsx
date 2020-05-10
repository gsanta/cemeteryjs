import { Registry } from '../../Registry';
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { ConceptType } from '../../models/concepts/Concept';

export class ModelConceptExporter implements IConceptExporter {
    type = ConceptType.ModelConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): JSX.Element {
        const models = this.registry.stores.canvasStore.getModelConcepts().map(model => {
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

    exportToFile(): JSX.Element {
        return this.export();
    }
}