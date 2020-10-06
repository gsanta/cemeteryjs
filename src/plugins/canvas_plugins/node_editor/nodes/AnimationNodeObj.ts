import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const AnimationNodeFacotry: NodeFactory = {
    createNodeObj(graph: NodeGraph): NodeObj {
        return new AnimationNodeObj(graph);
    },

    createController(plugin: UI_Plugin, registry: Registry): FormController {
        const controller = new FormController(plugin, registry);
        controller.registerPropControl(new AnimationMeshController());
        controller.registerPropControl(new StartFrameController());
        controller.registerPropControl(new EndFrameController());
        return controller;
    },

    createExecutor(): INodeExecutor {
        return new AnimationNodeExecutor();
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
}


export class AnimationNodeExecutor implements INodeExecutor {
    execute(nodeObj: NodeObj, registry: Registry) {
        if (nodeObj.getParam('startFrame').val !== 0 && nodeObj.getParam('endFrame').val !== 0) {
            const meshView = <MeshView> registry.stores.viewStore.getById(nodeObj.getParam('mesh').val);
            
            // if (!this.isAnimationPlaying) {
            //     const canPlay = registry.engine.meshes.playAnimation(meshView.getObj(), nodeObj.getParam('startFrame').val, nodeObj.getParam('endFrame').val, true);
            //     if (canPlay) {
            //         this.isAnimationPlaying = true;
            //     }
            // }
        }
    }

    stop() {}
}

export class AnimationMeshController extends PropController<string> {

    constructor() {
        super('mesh');
    }


    values(context) {
        return context.registry.stores.viewStore.getViewsByType(MeshViewType).map(meshView => meshView.id);
    }
    
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        const meshParam = nodeView.getObj().getParam('mesh').val;
        return context.registry.stores.viewStore.getById(meshParam)?.id;
    }

    change(val: string, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        nodeView.getObj().setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class StartFrameController extends PropController<string> {

    constructor() {
        super('startFrame');
    }

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('startFrame').val;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context, element) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;

        try {
            const val = parseFloat(context.getTempVal());
            nodeView.getObj().setParam('startFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

export class EndFrameController extends PropController<string> {

    constructor() {
        super('endFrame');
    }

    defaultVal(context: PropContext, element: UI_InputElement) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        return nodeView.getObj().getParam('endFrame').val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext, element: UI_Element) {
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;

        try {
            const val = parseFloat(context.getTempVal());
            nodeView.getObj().setParam('endFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}