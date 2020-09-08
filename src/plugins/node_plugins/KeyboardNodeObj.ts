import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { NodeView } from "../../core/models/views/NodeView";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";

export class KeyboardNodeObj extends NodeObj {
    type: BuiltinNodeType.Keyboard;
    category: NodeCategory.Default;

    params: NodeParam[] = [
        {
            name: 'key',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    connections = [
        {
            direction: 'output',
            name: 'output'
        }
    ];
    
    execute(registry: Registry) {}

    static instantiate(): NodeObj {
        return new KeyboardNodeObj();
    }

    newInstance(): KeyboardNodeObj {
        return new KeyboardNodeObj();
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        controller.registerPropControl('key', KeyControl);
        return controller;
    } 
}

const KeyControl: PropControl<string> = {
    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('key');
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    },

    blur(context, element: UI_InputElement) {
        const nodeObj = (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj;
        nodeObj.setParam('key', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}