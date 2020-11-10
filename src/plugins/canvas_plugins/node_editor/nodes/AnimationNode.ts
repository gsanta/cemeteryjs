import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeFactory } from "../../../../core/services/NodePlugin";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { NodeRenderer } from "../NodeRenderer";
import { AbstractNode } from "./AbstractNode";

export const AnimationNodeType = 'animation-node-obj';

export class AnimationNode extends AbstractNode {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = AnimationNodeType;
    displayName = 'Animation';
    category = 'Default';

    
    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new AnimationMeshController(nodeView), new StartFrameController(nodeView), new EndFrameController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputLinks();
        obj.outputs = this.getOutputLinks();
        obj.executor = new AnimationNodeExecutor(this.registry);
        obj.id = this.registry.stores.objStore.generateId(obj);

        return obj;
    }

    private getParams(): NodeParam[] {
        return [
            {
                name: 'mesh',
                val: '',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string'
                }
            },
            {
                name: 'startFrame',
                val: 0,
                uiOptions: {
                    inputType: 'textField',
                    valueType: 'number'
                }
            },
            {
                name: 'endFrame',
                val: 0,
                uiOptions: {
                    inputType: 'textField',
                    valueType: 'number'
                }
            }
        ];
    }

    private getOutputLinks(): NodeLink[] {
        return [];
    }

    private getInputLinks(): NodeLink[] {
        return [
            {
                name: 'action'
            }
        ];
    }
}

export class AnimationNodeExecutor implements INodeExecutor {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    execute(nodeObj: NodeObj) {
        if (nodeObj.getParam('startFrame').val !== 0 && nodeObj.getParam('endFrame').val !== 0) {
            const meshView = <MeshView> this.registry.data.view.node.getById(nodeObj.getParam('mesh').val);
            
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
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(meshView => meshView.id);
    }
    
    defaultVal(context: PropContext) {
        const meshParam = this.nodeView.getObj().getParam('mesh').val;
        return context.registry.data.view.node.getById(meshParam)?.id;
    }

    change(val: string, context: PropContext) {
        this.nodeView.getObj().setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class StartFrameController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['startFrame']; }

    defaultVal() {
        return this.nodeView.getObj().getParam('startFrame').val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext) {
        try {
            const val = parseFloat(context.getTempVal());
            this.nodeView.getObj().setParam('startFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

export class EndFrameController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['endFrame']; }

    defaultVal() {
        return this.nodeView.getObj().getParam('endFrame').val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext) {
        try {
            const val = parseFloat(context.getTempVal());
            this.nodeView.getObj().setParam('endFrame', val);
        } catch (e) {
            console.log(e);
        }
        context.clearTempVal();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}