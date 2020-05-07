import { IConceptImporter } from "./IConceptImporter";
import { ConceptGroupJson } from "./ImportService";
import { PathConcept } from "../../../editor/models/concepts/PathConcept";
import { ConceptType } from "../../../editor/models/concepts/Concept";
import { Stores } from "../../../editor/stores/Stores";
import { ModelConcept } from "../../../editor/models/concepts/ModelConcept";
import { Registry } from "../../../editor/Registry";

export interface ModelJson {
    _attributes: {
        'data-id': string;
        'data-model-path': string;
        'data-texture-path': string;
    }
}

export interface ModelGroupJson extends ConceptGroupJson {
    g: ModelJson[] | ModelJson;
}

export class ModelConceptImporter implements IConceptImporter {
    type = ConceptType.ModelConcept;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: ModelGroupJson): void {
        const modelJsons =  (<ModelJson[]> group.g).length ? <ModelJson[]> group.g : [<ModelJson> group.g];
        
        modelJsons.forEach(json => {
            const modelConcept = new ModelConcept();
            modelConcept.id = json._attributes['data-id'];
            modelConcept.modelPath = json._attributes['data-model-path'];
            modelConcept.texturePath = json._attributes['data-texture-path'];

            this.registry.stores.canvasStore.addMeta(modelConcept);
        });
    }
}