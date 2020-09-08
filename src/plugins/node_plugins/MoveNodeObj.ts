import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl } from "../../core/plugins/controllers/AbstractController";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { UI_Region } from "../../core/plugins/UI_Plugin";

export class MoveNodeObj extends NodeObj {
    type: BuiltinNodeType.Move;
    category: NodeCategory.Default;
    
    constructor() {
        super();
        this.controller.registerPropControl('move', MoveControl);
        this.controller.registerPropControl('speed', SpeedControl);
    }

    params: NodeParam[] = [
        {
            name: 'move',
            val: '',
            inputType: 'list',
            valueType: 'string'
        },
        {
            name: 'speed',
            val: 0.5,
            inputType: 'textField',
            valueType: 'number'
        }
    ];

    connections = [
        {
            direction: 'input',
            name: 'input'
        },
        {
            direction: 'input',
            name: 'mesh'
        },
        {
            direction: 'output',
            name: 'animation'
        }
    ];

    static instantiate(): NodeObj {
        return new MoveNodeObj();
    }
}

const MoveControl: PropControl<string> = {
    values(context) {
        return ['forward', 'backward'];
    },

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('move');
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

const SpeedControl: PropControl<string> = {
    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('speed');
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    },

    blur(context, element: UI_InputElement) {
        const nodeObj = (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj;
        nodeObj.setParam('speed', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}