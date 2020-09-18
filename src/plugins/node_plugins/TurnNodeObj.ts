import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { PropControl, AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_InputElement } from "../../core/ui_components/elements/UI_InputElement";
import { NodeView } from "../../core/models/views/NodeView";
import { Registry } from "../../core/Registry";
import { NodeGraph } from "../../core/services/node/NodeGraph";
import { MeshControl } from "./MeshNodeObj";
import { MeshView } from "../../core/models/views/MeshView";
import { UI_Plugin } from "../../core/plugins/UI_Plugin";
import { NodeFactory } from "../../core/services/NodeService";

export const TurnNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new TurnNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('mesh', MeshControl);
        controller.registerPropControl('turn', TurnControl);
        return controller;
    }
}

export class TurnNodeObj extends NodeObj {
    type = BuiltinNodeType.Turn;
    category = NodeCategory.Default;


    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        });

        this.addParam({
            name: 'turn',
            val: '',
            inputType: 'list',
            valueType: 'string'
        });
    }

    inputs = [
        {
            name: 'input'
        }
    ]

    outputs = [
        {
            name: 'animation'
        }
    ];

    execute(registry: Registry) {
        const meshId = this.getParam('mesh').val;
        const meshView = registry.stores.canvasStore.getById(meshId) as MeshView;

        if (meshView) {
            if (this.getParam('turn').val === 'turn-left') {
                meshView.obj.rotate(-0.02);
            } else {
                meshView.obj.rotate(0.02);
            }
        }
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

        nodeView.obj.setParam('turn', val);
        context.registry.services.render.reRenderAll();
    }
}