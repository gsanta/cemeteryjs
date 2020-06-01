
import { NodeView, NodeViewJson } from '../../../../core/models/views/NodeView';
import { ConceptType } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { IViewImporter } from '../../../../core/services/import/IViewImporter';
import { ViewContainerJson } from '../../../common/io/AbstractPluginImporter';
import { DataJson } from './NodeViewImporter';
import { NodeConnectionView } from '../../../../core/models/views/NodeConnectionView';

export class NodeConnectionViewImporter implements IViewImporter<DataJson> {
    type = ConceptType.ActionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: ViewContainerJson<DataJson>): void {
        const rectJsons =  group.g.length ?  group.g : [<any> group.g];

        rectJsons.forEach(rect => {

            const json: NodeViewJson =  JSON.parse(rect._attributes['data-data']);

            const nodeConnectionView = new NodeConnectionView()

            const nodeView = new NodeView(this.registry.stores.nodeStore.graph);
            nodeView.fromJson(json);

            this.registry.stores.nodeStore.addNode(nodeView);
        });
    }
}