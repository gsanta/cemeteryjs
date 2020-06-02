import { NodeConnectionView, NodeConnectionViewJson } from '../../../core/models/views/NodeConnectionView';
import { NodeView, NodeViewJson } from '../../../core/models/views/NodeView';
import { ConceptType, View } from "../../../core/models/views/View";
import { Registry } from "../../../core/Registry";
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";
import { IPluginJson } from "../../common/io/IPluginExporter";

export class NodeEditorImporter extends AbstractPluginImporter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    import(pluginJson: IPluginJson, viewMap: Map<string, View>): void {
        const nodeJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ConceptType.ActionConcept);

        nodeJsons.views.forEach((viewJson: NodeViewJson) => {
            const nodeView: NodeView = new NodeView(this.registry.stores.nodeStore.graph);
            nodeView.fromJson(viewJson, viewMap);

            this.registry.stores.nodeStore.addNode(nodeView);
        });

        const connectionJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ConceptType.ActionNodeConnectionConcept);

        connectionJsons.views.forEach((viewJson: NodeConnectionViewJson) => {
            const connectionView: NodeConnectionView = new NodeConnectionView();
            connectionView.fromJson(viewJson, viewMap);

            this.registry.stores.nodeStore.addConnection(connectionView);
        });
    }
}