import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshView } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshController } from "./MeshNodeObj";

export const MoveNodeFacotry: NodeFactory = {
    createNodeObj(graph: NodeGraph): NodeObj {
        return new MoveNodeObj(graph);
    },

    createPropControllers(): PropController[] {
        return [
            new MeshController(),
            new MeshMoveController(),
            new MeshSpeedController()
        ];
    },

    createExecutor(): INodeExecutor {
        return new MoveNodeExecutor();
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
            uiOptions: {
                inputType: 'list',
                valueType: 'string'
            }
        });

        this.addParam({
            name: 'move',
            val: 'forward',
            uiOptions: {
                inputType: 'list',
                valueType: 'string'
            }
        });

        this.addParam({
            name: 'speed',
            val: 0.5,
            uiOptions: {
                inputType: 'textField',
                valueType: 'number'
            }
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

        const meshView = registry.stores.views.getById(meshId) as MeshView;

        if (this.getParam('move').val === 'forward') {
            meshView.getObj().move(new Point_3(0, 0, 2));
        } else if (this.getParam('move').val === 'backward') {
            meshView.getObj().move(new Point_3(0, 0, -2));
        }
    }
}

export class MoveNodeExecutor implements INodeExecutor {
    execute(nodeObj: NodeObj, registry: Registry) {
        const meshId = nodeObj.getParam('mesh').val;

        const meshView = registry.stores.views.getById(meshId) as MeshView;

        if (nodeObj.getParam('move').val === 'forward') {
            meshView.getObj().move(new Point_3(0, 0, 2));
        } else if (nodeObj.getParam('move').val === 'backward') {
            meshView.getObj().move(new Point_3(0, 0, -2));
        }
    }

    executeStop() {}
}

export class MeshMoveController extends PropController<string> {
    acceptedProps() { return ['move']; }

    values(context) {
        return ['forward', 'backward'];
    }

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.views.getById(element.targetId) as NodeView).getObj().getParam('move');
    }

    change(val, context, element) {
        context.updateTempVal(val);
        const nodeView = context.registry.stores.views.getById(element.target) as NodeView;
        nodeView.getObj().setParam('move', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {
    acceptedProps() { return ['speed']; }

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.views.getById(element.targetId) as NodeView).getObj().getParam('speed');
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context, element: UI_InputElement) {
        const nodeObj = (context.registry.stores.views.getById(element.targetId) as NodeView).getObj();
        nodeObj.setParam('speed', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}