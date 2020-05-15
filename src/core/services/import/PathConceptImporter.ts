import { Registry } from "../../Registry";
import { PathConcept } from "../../models/concepts/PathConcept";
import { IConceptImporter } from "./IConceptImporter";
import { ConceptGroupJson } from "./ImportService";
import { ConceptType } from "../../models/concepts/Concept";
import { EditPoint } from "../../models/feedbacks/EditPoint";
import { FeedbackType } from '../../models/controls/IControl';

export interface PathJson {
    circle: {
        _attributes: {
            cx: number;
            cy: number;
            r: number;
        }
    }[];

    path: {
        _attributes: {
            'data-name': string;
            'data-json': string;
        }
    }
}

export interface PathGroupJson extends ConceptGroupJson {
    g: PathJson[] | PathJson;
}

export class PathConceptImporter implements IConceptImporter {
    type = ConceptType.PathConcept;
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: PathGroupJson): void {
        const pathJsons =  (<PathJson[]> group.g).length ? <PathJson[]> group.g : [<PathJson> group.g];
        
        pathJsons.forEach(json => {
            const path = new PathConcept();
            path.id = json.path._attributes['data-name'];
            path.parseJson(json.path._attributes['data-json'], () => this.registry.stores.canvasStore.generateUniqueName(FeedbackType.EditPointFeedback));

            this.registry.stores.canvasStore.addConcept(path);
        });
    }
}