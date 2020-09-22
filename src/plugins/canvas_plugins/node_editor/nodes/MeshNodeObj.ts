import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { ViewType } from "../../../../core/models/views/View";
import { AbstractController, PropControl } from "../../../../core/plugin/controller/AbstractController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const MeshNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new MeshNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('mesh', MeshControl);
        return controller;
    }
}

export const MeshNodeType = 'mesh-node-obj';
export class MeshNodeObj extends NodeObj {
    type = MeshNodeType;
    category = NodeCategory.Default;

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        });
    }

    outputs = [
        {
            name: 'action'
        }
    ];
}

export const MeshControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getViewsByType(ViewType.MeshView).map(meshView => meshView.id)
    },

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('mesh').val;
    },

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.obj.setParam('mesh', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}