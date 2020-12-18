import { NodeObj, NodeParams } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshView, MeshViewType } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";

export const AnimationNodeType = 'animation-node-obj';

export class AnimationNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = AnimationNodeType;
    displayName = 'Animation';
    category = 'Default';

    
    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new AnimationMeshController(nodeView.getObj()), new StartFrameController(nodeView.getObj()), new EndFrameController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new AnimationNodeParams(), {displayName: this.displayName});
        
        obj.executor = new AnimationNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class AnimationNodeParams extends NodeParams {
    readonly mesh: NodeParam = {
        name: 'mesh',
        field: NodeParamField.List,
        val: '',
    }

    readonly startFrame: NodeParam = {
        name: 'startFrame',
        field: NodeParamField.NumberField,
        val: 0,
    }
    
    readonly endFrame: NodeParam = {
        name: 'endFrame',
        field: NodeParamField.NumberField,
        val: 0,
    }
    
    readonly action: NodeParam = {
        name: 'action',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
}

export class AnimationNodeExecutor extends AbstractNodeExecutor<AnimationNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationNodeParams>) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        if (this.nodeObj.param.startFrame.val !== 0 && this.nodeObj.param.endFrame.val !== 0) {
            const meshView = <MeshView> this.registry.data.view.node.getById(this.nodeObj.param.mesh.val);
            
            // if (!this.isAnimationPlaying) {
            //     const canPlay = registry.engine.meshes.playAnimation(meshView.getObj(), nodeObj.getParam('startFrame').val, nodeObj.getParam('endFrame').val, true);
            //     if (canPlay) {
            //         this.isAnimationPlaying = true;
            //     }
            // }
        }
    }

    executeStop() {}
}

export class AnimationMeshController extends PropController<string> {
    private nodeObj: NodeObj<AnimationNodeParams>;

    constructor(nodeObj: NodeObj<AnimationNodeParams>) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(meshView => meshView.id);
    }
    
    defaultVal(context: PropContext) {
        const meshParam = this.nodeObj.param.mesh.val;
        return context.registry.data.view.node.getById(meshParam)?.id;
    }

    change(val: string, context: PropContext) {
        this.nodeObj.param.mesh.val = val;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class StartFrameController extends PropController<string> {
    private nodeObj: NodeObj<AnimationNodeParams>;

    constructor(nodeObj: NodeObj<AnimationNodeParams>) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['startFrame']; }

    defaultVal() {
        return this.nodeObj.param.startFrame.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext) {
        try {
            const val = parseFloat(context.getTempVal());
            this.nodeObj.param.startFrame.val = val;
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

export class EndFrameController extends PropController<string> {
    private nodeObj: NodeObj<AnimationNodeParams>;

    constructor(nodeObj: NodeObj<AnimationNodeParams>) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['endFrame']; }

    defaultVal() {
        return this.nodeObj.param.endFrame.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext) {
        try {
            const val = parseFloat(context.getTempVal());
            this.nodeObj.param.endFrame.val = val;
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}