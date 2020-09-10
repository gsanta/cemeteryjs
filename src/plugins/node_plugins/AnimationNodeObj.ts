import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";

export class AnimationNodeObj extends NodeObj {
    type = BuiltinNodeType.Animation;
    category = NodeCategory.Default;
    params: NodeParam[] = [
        {
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        },
        {
            name: 'animation',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    inputs = [
        {
            name: 'action'
        }
    ];

    static instantiate(): NodeObj {
        return new AnimationNodeObj();
    }

    newInstance(): AnimationNodeObj {
        return new AnimationNodeObj();
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        controller.registerPropControl('mesh', MeshControl);
        controller.registerPropControl('animation', AnimationControl);
        return controller;
    } 
}

const MeshControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getMeshViews().map(meshView => meshView.id);
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