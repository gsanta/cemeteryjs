import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { NodeView } from "../../core/models/views/NodeView";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { getAllKeys } from "../../core/services/input/KeyboardService";
import { NodeGraph } from "../../core/services/node/NodeGraph";

export class KeyboardNodeObj extends NodeObj {
    type = BuiltinNodeType.Keyboard;
    category = NodeCategory.Default;

    params: NodeParam[] = [
        {
            name: 'key',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    outputs = [
        {
            name: 'output'
        }
    ];
    
    execute(registry: Registry) {
        const connection = this.connections.get('output');
        connection && connection.getOtherNode(this).execute(registry);
    }

    newInstance(graph: NodeGraph): KeyboardNodeObj {
        return new KeyboardNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        controller.registerPropControl('key', KeyControl);
        return controller;
    } 
}

const KeyControl: PropControl<string> = {
    values() {
        return getAllKeys();
    },

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('key');
    },

    change(val, context, element: UI_InputElement) {
        context.updateTempVal(val);
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.obj.setParam('key', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}