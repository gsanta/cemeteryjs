
import { NodeView, NodeViewJson } from '../../../../core/models/views/NodeView';
import { ConceptType, View } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { IViewImporter } from '../../../../core/services/import/IViewImporter';
import { ViewContainerJson } from '../../../common/io/AbstractPluginImporter';

export interface DataJson {
    _attributes: {
        "data-data": string
    }
}

export class NodeViewImporter implements IViewImporter<DataJson> {
    type = ConceptType.ActionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: ViewContainerJson<DataJson>, viewMap: Map<string, View>): void {
        const rectJsons =  group.g.length ?  group.g : [<any> group.g];

        rectJsons.forEach(rect => {

            const json: NodeViewJson =  JSON.parse(rect._attributes['data-data']);

            const nodeView = new NodeView(this.registry.stores.nodeStore.graph);
            nodeView.fromJson(json, viewMap);

            this.registry.stores.nodeStore.addNode(nodeView);
        });
    }
}