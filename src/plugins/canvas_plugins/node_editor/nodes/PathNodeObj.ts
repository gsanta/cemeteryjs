import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PathViewType } from "../../../../core/models/views/PathView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const PathNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new PathNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): FormController {
        const controller = new FormController(plugin, registry);
        controller.registerPropControl(new PathController());
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

export class PathController extends PropController<string> {

    constructor() {
        super('path')
    }

    values(context) {
        return context.registry.stores.viewStore.getViewsByType(PathViewType).map(pathView => pathView.id);
    }

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('path').val;
    }

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        nodeView.getObj().setParam('path', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}