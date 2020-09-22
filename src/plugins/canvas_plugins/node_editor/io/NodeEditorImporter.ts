import { NodeConnectionView, NodeConnectionViewJson } from '../../../../core/models/views/NodeConnectionView';
import { NodeViewJson } from '../../../../core/models/views/NodeView';
import { ViewJson, ViewType } from "../../../../core/models/views/View";
import { AppJson } from '../../../../core/services/export/ExportService';
import { AbstractPluginImporter } from "../../../../core/services/import/AbstractPluginImporter";

export class NodeEditorImporter extends AbstractPluginImporter {
    async import(appJson: AppJson): Promise<void> {
        const views = appJson[this.plugin.id].views;

        views.forEach((viewJson: ViewJson) => {
            switch(viewJson.type) {
                case ViewType.NodeView:
                    this.importNodeView(<NodeViewJson> viewJson);
                    break;
                case ViewType.NodeConnectionView:
                    this.importConnection(<NodeConnectionViewJson> viewJson);
                    break;
            }
        });
    }

    private importNodeView(viewJson: NodeViewJson) {
        const nodeView = this.registry.services.node.createNodeView(viewJson.nodeObj.type);
        nodeView.fromJson(viewJson, this.registry);

        this.registry.stores.nodeStore.addView(nodeView);
    }

    private importConnection(viewJson: NodeConnectionViewJson) {
        const connectionView: NodeConnectionView = new NodeConnectionView();
        connectionView.fromJson(viewJson, this.registry);

        this.registry.stores.nodeStore.addView(connectionView);
    }
}