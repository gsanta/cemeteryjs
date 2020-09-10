import { NodeConnectionView, NodeConnectionViewJson } from '../../../../core/models/views/NodeConnectionView';
import { NodeView, NodeViewJson } from '../../../../core/models/views/NodeView';
import { ViewType, View } from "../../../../core/models/views/View";
import { AppJson } from '../../../../core/services/export/ExportService';
import { AbstractPluginImporter } from "../../../../core/services/import/AbstractPluginImporter";
import { IPluginJson } from '../../../../core/plugins/IPluginExporter';

export class NodeEditorImporter extends AbstractPluginImporter {
    async import(appJson: AppJson): Promise<void> {
        const pluginJson = this.getPluginJson(appJson);
        const nodeJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.NodeView);

        nodeJsons.views.forEach((viewJson: NodeViewJson) => {
            // const nodeView: NodeView = new NodeView();
            // nodeView.fromJson(viewJson, viewMap);

            const nodeView = this.registry.services.node.createNodeView(viewJson.nodeObj.type);
            nodeView.fromJson(viewJson, this.registry);

            this.registry.stores.nodeStore.addNode(nodeView);
        });

        this.importConnections(pluginJson);
    }

    private importConnections(pluginJson: IPluginJson) {
        const connectionJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.NodeConnectionView);

        connectionJsons.views.forEach((viewJson: NodeConnectionViewJson) => {
            const connectionView: NodeConnectionView = new NodeConnectionView();
            connectionView.fromJson(viewJson, this.registry);

            this.registry.stores.nodeStore.addConnection(connectionView);
        });
    }
}