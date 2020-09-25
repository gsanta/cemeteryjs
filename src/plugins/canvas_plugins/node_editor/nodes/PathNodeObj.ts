import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { ViewType } from "../../../../core/models/views/View";
import { AbstractController, PropControl } from "../../../../core/plugin/controller/AbstractController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const PathNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new PathNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('path', PathControl);
        return controller;
    }
}

export const PathNodeType = 'path-node-obj';
export class PathNodeObj extends NodeObj {
    type = PathNodeType;
    category = NodeCategory.Default;
    displayName = 'Path';
    
    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'path',
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

const PathControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getViewsByType(ViewType.PathView).map(pathView => pathView.id);
    },

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('path').val;
    },

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.getObj().setParam('path', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}