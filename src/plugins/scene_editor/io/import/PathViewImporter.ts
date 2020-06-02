import { FeedbackType } from '../../../../core/models/views/child_views/ChildView';
import { PathView, PathViewJson } from '../../../../core/models/views/PathView';
import { ConceptType, View } from "../../../../core/models/views/View";
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

    import(group: ViewContainerJson<PathJson>, viewMap: Map<string, View>): void {
        const pathJsons =  group.g.length ? group.g : [<any> group.g];

        pathJsons.forEach(path => {

            const json: PathViewJson =  JSON.parse(path._attributes['data-data']);

            const pathView = new PathView();
            pathView.fromJson(json, viewMap);

            this.registry.stores.canvasStore.addConcept(pathView);
        });
    }
}