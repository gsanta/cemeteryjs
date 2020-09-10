import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Region } from "../../core/plugins/UI_Plugin";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { Registry } from "../../core/Registry";
import { NodeGraph } from "../../core/services/node/NodeGraph";

export class MeshNodeObj extends NodeObj {
    type = BuiltinNodeType.Mesh;
    category = NodeCategory.Default;

    params: NodeParam[] = [
        {
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    outputs = [
        {
            name: 'action'
        }
    ];

    newInstance(graph: NodeGraph): NodeObj {
        return new MeshNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        controller.registerPropControl('mesh', MeshControl);
        return controller;
    }
}

export const MeshControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getMeshViews().map(meshConcept => meshConcept.id)
    },

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('mesh').val;
    },

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.obj.setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}