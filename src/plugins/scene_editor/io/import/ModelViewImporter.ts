import { Registry } from "../../../../core/Registry";
import { ModelConcept } from "../../../../core/models/ModelConcept";
import { IViewImporter } from "../../../../core/services/import/IViewImporter";
import { ConceptType } from "../../../../core/models/views/View";
import { ViewContainerJson } from "../../../common/io/AbstractPluginImporter";

export interface ModelJson {
    _attributes: {
        'data-id': string;
        'data-model-path': string;
        'data-texture-path': string;
    }
}

export class ModelViewImporter implements IViewImporter<ModelJson> {
    type = ConceptType.ModelConcept;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: ViewContainerJson<ModelJson>): void {
        const modelJsons =  group.g.length ? group.g : [<any> group.g];
        
        modelJsons.forEach(json => {
            const modelConcept = new ModelConcept();
            modelConcept.id = json._attributes['data-id'];
            modelConcept.modelPath = json._attributes['data-model-path'];
            modelConcept.texturePath = json._attributes['data-texture-path'];

            this.registry.stores.canvasStore.addModel(modelConcept);
        });
    }
}