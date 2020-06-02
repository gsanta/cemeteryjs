
import { NodeConnectionView, NodeConnectionViewJson } from '../../../../core/models/views/NodeConnectionView';
import { ConceptType, View } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { IViewImporter } from '../../../../core/services/import/IViewImporter';
import { ViewContainerJson } from '../../../common/io/AbstractPluginImporter';
import { DataJson } from './NodeViewImporter';

export class NodeConnectionViewImporter implements IViewImporter<DataJson> {
    type = ConceptType.ActionNodeConnectionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: ViewContainerJson<DataJson>, viewMap: Map<string, View>): void {
        const rectJsons =  group.g.length ?  group.g : [<any> group.g];

        rectJsons.forEach(rect => {

            const json: NodeConnectionViewJson =  JSON.parse(rect._attributes['data-data']);

            const nodeConnectionView = new NodeConnectionView();
            nodeConnectionView.fromJson(json, viewMap);

            this.registry.stores.nodeStore.addConnection(nodeConnectionView);
        });
    }
}