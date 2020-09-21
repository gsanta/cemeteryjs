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
        controller.registerPropControl('startFrame', StartFrameControl);
        controller.registerPropControl('endFrame', EndFrameControl);
        return controller;
    }
}

export const AnimationNodeType = 'animation-node-type';
export class AnimationNodeObj extends NodeObj {
    type = AnimationNodeType;
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
            name: 'startFrame',
            val: 0,
            inputType: 'textField',
            valueType: 'number'
        });

        this.addParam({
            name: 'endFrame',
            val: 0,
            inputType: 'textField',
            valueType: 'number'
        });
    }

    inputs = [
        {
            name: 'action'
        }
    ];

    execute(registry: Registry) {
        if (this.getParam('startFrame').val !== 0 && this.getParam('endFrame').val !== 0) {
            const meshView = registry.stores.canvasStore.getById(this.getParam('mesh').val);
            1;
        }
    }
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

const StartFrameControl: PropControl<string> = {
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.obj.getParam('startFrame').val;
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    },

    blur(context, element) {
        try {
            const val = parseFloat(context.getTempVal());
            element.data.obj.setParam('startFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

const EndFrameControl: PropControl<string> = {
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.obj.getParam('endFrame').val;
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    },

    blur(context, element) {
        try {
            const val = parseFloat(context.getTempVal());
            element.data.obj.setParam('endFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}