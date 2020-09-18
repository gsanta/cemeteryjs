import { BuiltinNodeType, NodeCategory, NodeObj, NodeParam } from "../../core/models/game_objects/NodeObj";
import { NodeView } from "../../core/models/views/NodeView";
import { ViewType } from "../../core/models/views/View";
import { AbstractController, PropControl } from "../../core/plugins/controllers/AbstractController";
import { UI_Plugin, UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { NodeGraph } from "../../core/services/node/NodeGraph";
import { NodeFactory } from "../../core/services/NodeService";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";

export const AnimationNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new AnimationNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('mesh', MeshControl);
        controller.registerPropControl('animation', AnimationControl);
        return controller;
    }
}

export class AnimationNodeObj extends NodeObj {
    type = BuiltinNodeType.Animation;
    category = NodeCategory.Default;

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        });
        
        this.addParam({
            name: 'animation',
            val: '',
            inputType: 'list',
            valueType: 'string'
        })
    }

    inputs = [
        {
            name: 'action'
        }
    ];
}

const MeshControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getViewsByType(ViewType.MeshView).map(meshView => meshView.id);
    },
    
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        const meshParam = nodeView.obj.getParam('mesh').val;
        return context.registry.stores.canvasStore.getById(meshParam)?.id;
    },

    change(val: string, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.obj.setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

const AnimationControl: PropControl<string> = {
    values() {
        return ['animation1', 'animation2'];
    },

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.obj.getParam('animation');
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    },

    blur(context, element) {
        element.data.obj.setParam('animation', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}