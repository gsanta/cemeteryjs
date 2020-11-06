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

    getParams(): NodeParam[] {
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

    getOutputLinks(): NodeLink[] {
        return [];
    }

    getInputLinks(): NodeLink[] {
        return [
            {
                name: 'action'
            }
        ];
    }

    getController(): FormController {
        const propControllers = [
            new AnimationMeshController(),
            new StartFrameController(),
            new EndFrameController()
        ];

        return new FormController(undefined, this.registry, propControllers);
    }

    getExecutor(): INodeExecutor {
        return new AnimationNodeExecutor(this.registry);
    }
}

export class AnimationNodeExecutor implements INodeExecutor {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    execute(nodeObj: NodeObj) {
        if (nodeObj.getParam('startFrame').val !== 0 && nodeObj.getParam('endFrame').val !== 0) {
            const meshView = <MeshView> this.registry.stores.views.getById(nodeObj.getParam('mesh').val);
            
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
    acceptedProps() { return ['mesh']; }

    values(context) {
        return context.registry.stores.views.getViewsByType(MeshViewType).map(meshView => meshView.id);
    }
    
    defaultVal(context: PropContext, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        const meshParam = nodeView.getObj().getParam('mesh').val;
        return context.registry.stores.views.getById(meshParam)?.id;
    }

    change(val: string, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        nodeView.getObj().setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class StartFrameController extends PropController<string> {
    acceptedProps() { return ['startFrame']; }

    defaultVal(context: PropContext, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        return nodeView.getObj().getParam('startFrame').val;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext, element) {
        const nodeView = context.registry.stores.views.getById(element.target) as NodeView;

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
    acceptedProps() { return ['endFrame']; }

    defaultVal(context: PropContext, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        return nodeView.getObj().getParam('endFrame').val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur(context: PropContext, element: UI_Element) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;

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