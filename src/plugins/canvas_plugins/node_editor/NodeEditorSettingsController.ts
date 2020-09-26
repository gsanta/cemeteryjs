import { AbstractController, PropContext } from '../../../core/plugin/controller/AbstractController';
import { UI_Plugin, UI_Region } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { NodeEditorControllerId } from "./NodeEditorController";
import { UI_ListItem } from '../../../core/ui_components/elements/UI_ListItem';
import { NodeObj, NodeObjType } from '../../../core/models/objs/NodeObj';
import { NodeView, NodeViewType } from '../../../core/models/views/NodeView';

export enum NodeEditorSettingsProps {
    DragNode = 'DragNode'
}

export const NodeEditorSettingsControllerId = 'node_editor_settings_controller_id';
export class NodeEditorSettingsController extends AbstractController<string> {
    id = NodeEditorControllerId;

    droppableId: string; 

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(NodeEditorSettingsProps.DragNode)
            .onDndStart((dropType) => {
                this.registry.services.render.reRender(UI_Region.Sidepanel, UI_Region.Canvas1);
            })
            .onDndEnd((context: PropContext<string>, element) => {
                // TODO can be removed when there will be only a single NodeObject
                this.registry.services.node.currentNodeType = (element as UI_ListItem).listItemId;
                const nodeObj = <NodeObj> this.registry.services.objService.createObj(NodeObjType);
                const nodeView: NodeView = <NodeView> this.registry.services.viewService.createView(NodeViewType);
                nodeView.setObj(nodeObj);
        
                this.registry.stores.objStore.addObj(nodeObj);
                this.registry.stores.viewStore.addView(nodeView);

                nodeView.getBounds().moveTo(this.registry.services.pointer.pointer.curr);
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Canvas1);
            });
    }
}