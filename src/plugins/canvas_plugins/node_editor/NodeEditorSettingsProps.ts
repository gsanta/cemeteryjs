import { NodeObj, NodeObjType } from "../../../core/models/objs/NodeObj";
import { NodeView, NodeViewType } from "../../../core/models/views/NodeView";
import { PropContext, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { UI_Element } from "../../../core/ui_components/elements/UI_Element";
import { UI_ListItem } from "../../../core/ui_components/elements/UI_ListItem";

export enum NodeEditorSettingsProps {
    DragNode = 'DragNode'
}

export class DragNodeController extends PropController {
    acceptedProps() { return [NodeEditorSettingsProps.DragNode]; }

    onDndStart(context: PropContext) {
        context.registry.services.render.reRender(UI_Region.Sidepanel, UI_Region.Canvas1);
        context.registry.services.render.reRenderAll();
    }

    onDndEnd(context: PropContext, element: UI_Element) {
        const nodeType = (element as UI_ListItem).listItemId;
        const nodeObj = context.registry.data.helper.node.createObj(nodeType);
        const nodeView: NodeView = context.registry.data.helper.node.createView(nodeType);
        nodeView.setObj(nodeObj);

        context.registry.stores.objStore.addObj(nodeObj);
        context.registry.stores.views.addView(nodeView);

        nodeView.getBounds().moveTo(context.registry.services.pointer.pointer.curr);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
} 