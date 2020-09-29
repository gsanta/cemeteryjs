import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const AnimationNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new AnimationNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): FormController {
        const controller = new FormController(plugin, registry);
        controller.registerPropControl('mesh', MeshControl);
        controller.registerPropControl('startFrame', StartFrameControl);
        controller.registerPropControl('endFrame', EndFrameControl);
        return controller;
    }
}

export const AnimationNodeType = 'animation-node-obj';
export class AnimationNodeObj extends NodeObj {
    type = AnimationNodeType;
    category = NodeCategory.Default;
    displayName = 'Animation';

    private isAnimationPlaying = false;

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
            const meshView = <MeshView> registry.stores.viewStore.getById(this.getParam('mesh').val);
            
            if (!this.isAnimationPlaying) {
                const canPlay = registry.engine.meshes.playAnimation(meshView.getObj(), this.getParam('startFrame').val, this.getParam('endFrame').val, true);
                if (canPlay) {
                    this.isAnimationPlaying = true;
                }
            }
        }
    }
}

const MeshControl: PropController<string> = {
    values(context) {
        return context.registry.stores.viewStore.getViewsByType(MeshViewType).map(meshView => meshView.id);
    },
    
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        const meshParam = nodeView.getObj().getParam('mesh').val;
        return context.registry.stores.viewStore.getById(meshParam)?.id;
    },

    change(val: string, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        nodeView.getObj().setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

const StartFrameControl: PropController<string> = {
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('startFrame').val;
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    },

    blur(context, element) {
        try {
            const val = parseFloat(context.getTempVal());
            element.data.getObj().setParam('startFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

const EndFrameControl: PropController<string> = {
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('endFrame').val;
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    },

    blur(context, element) {
        try {
            const val = parseFloat(context.getTempVal());
            element.data.getObj().setParam('endFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}