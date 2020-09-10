import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Region } from "../../core/plugins/UI_Plugin";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { Registry } from "../../core/Registry";

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

    newInstance(): NodeObj {
        return new MeshNodeObj();
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        controller.registerPropControl('mesh', MeshControl);
        return controller;
    }
}

const MeshControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getMeshViews().map(meshConcept => meshConcept.id)
    },

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj.getParam('mesh');
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    },
    
    blur(context, element: UI_InputElement) {
        const nodeObj = (context.registry.stores.nodeStore.getById(element.target) as NodeView).obj;
        nodeObj.setParam('mesh', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}