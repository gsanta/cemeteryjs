import { Registry } from "../../Registry";
import { PathView } from "../../models/views/PathView";
import { IConceptImporter } from "./IConceptImporter";
import { ConceptGroupJson } from "./ImportService";
import { ConceptType } from "../../models/views/View";
import { EditPointView } from "../../models/views/child_views/EditPointView";
import { FeedbackType } from '../../models/views/child_views/ChildView';

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
            const path = new PathView();
            path.id = json.path._attributes['data-name'];
            path.parseJson(json.path._attributes['data-json'], () => this.registry.stores.canvasStore.generateUniqueName(FeedbackType.EditPointFeedback));

            this.registry.stores.canvasStore.addConcept(path);
        });
    }
}