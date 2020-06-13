import { NodeConnectionView, NodeConnectionViewJson } from '../../../core/models/views/NodeConnectionView';
import { NodeView, NodeViewJson } from '../../../core/models/views/NodeView';
import { ViewType, View } from "../../../core/models/views/View";
import { AppJson } from '../../../core/services/export/ExportService';
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";

export class NodeEditorImporter extends AbstractPluginImporter {
    import(appJson: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(appJson);
        const nodeJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.NodeView);

        nodeJsons.views.forEach((viewJson: NodeViewJson) => {
            const nodeView: NodeView = new NodeView(this.registry.stores.nodeStore.graph);
            nodeView.fromJson(viewJson, viewMap);

            this.registry.stores.nodeStore.addNode(nodeView);
        });

        const connectionJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.NodeConnectionView);

        connectionJsons.views.forEach((viewJson: NodeConnectionViewJson) => {
            const connectionView: NodeConnectionView = new NodeConnectionView();
            connectionView.fromJson(viewJson, viewMap);

            this.registry.stores.nodeStore.addConnection(connectionView);
        });
    }
}