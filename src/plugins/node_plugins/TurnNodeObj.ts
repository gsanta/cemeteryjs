import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { Registry } from "../../core/Registry";
import { NodeGraph } from "../../core/services/node/NodeGraph";

export class TurnNodeObj extends NodeObj {
    type = BuiltinNodeType.Turn;
    category = NodeCategory.Default;

    params: NodeParam[] = [
        {
            name: 'turn',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    inputs = [
        {
            name: 'input'
        },
        {
            name: 'mesh'
        },
    ]

    outputs = [
        {
            name: 'animation'
        }
    ];

    newInstance(graph: NodeGraph): NodeObj {
        return new TurnNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        controller.registerPropControl('turn', TurnControl);
        return controller;
    }
}

const TurnControl: PropControl<string> = {
    values(context) {
        return ['turn-left', 'turn-right'];
    },

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.obj.getParam('turn').val;
    },

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;

        nodeView.obj.setParam('turn', context.clearTempVal());
        this.registry.services.render.reRenderAll();
    }
}