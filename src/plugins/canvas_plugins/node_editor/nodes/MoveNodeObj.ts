import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshView } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { MeshController } from "./MeshNodeObj";

export const MoveNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new MoveNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): FormController {
        const controller = new FormController(plugin, registry);
        controller.registerPropControl('mesh', new MeshController());
        controller.registerPropControl('move', new MeshMoveController());
        controller.registerPropControl('speed', new MeshSpeedController());
        return controller;
    }
}

export const MoveNodeType = 'move-node-obj';
export class MoveNodeObj extends NodeObj {
    type = MoveNodeType;
    category = NodeCategory.Default;
    displayName = 'Move';

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        });

        this.addParam({
            name: 'move',
            val: '',
            inputType: 'list',
            valueType: 'string'
        });

        this.addParam({
            name: 'speed',
            val: 0.5,
            inputType: 'textField',
            valueType: 'number'
        });
    }

    inputs = [
        {
            name: 'input'
        }
    ];

    outputs = [
        {
            name: 'animation'
        }
    ];

    execute(registry: Registry) {
        const meshId = this.getParam('mesh').val;

        const meshView = registry.stores.viewStore.getById(meshId) as MeshView;
        meshView.getObj().move(new Point(0, 2));
    }
}

export class MeshMoveController extends PropController<string> {

    constructor() {
        super('move');
    }

    values(context) {
        return ['forward', 'backward'];
    }

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.viewStore.getById(element.target) as NodeView).getObj().getParam('move');
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {

    constructor() {
        super('speed');
    }

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.viewStore.getById(element.target) as NodeView).getObj().getParam('speed');
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context, element: UI_InputElement) {
        const nodeObj = (context.registry.stores.viewStore.getById(element.target) as NodeView).getObj();
        nodeObj.setParam('speed', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}