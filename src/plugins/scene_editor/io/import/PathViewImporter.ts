import { FeedbackType } from '../../../../core/models/views/child_views/ChildView';
import { PathView } from "../../../../core/models/views/PathView";
import { ConceptType } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IViewImporter } from "../../../../core/services/import/IViewImporter";
import { ViewContainerJson } from '../../../common/io/AbstractPluginImporter';

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

export class PathViewImporter implements IViewImporter<PathJson> {
    type = ConceptType.PathConcept;
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: ViewContainerJson<PathJson>): void {
        const pathJsons =  group.g.length ? group.g : [<any> group.g];
        
        pathJsons.forEach(json => {
            const path = new PathView();
            path.id = json.path._attributes['data-name'];
            path.parseJson(json.path._attributes['data-json'], () => this.registry.stores.canvasStore.generateUniqueName(FeedbackType.EditPointFeedback));
            
            this.registry.stores.canvasStore.addConcept(path);
        });
    }
}