import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { MeshView } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { AbstractNode } from "./AbstractNode";
import { MeshController } from "./MeshNodeObj";

export const MoveNodeType = 'move-node-obj';

export class MoveNode extends AbstractNode {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MoveNodeType;
    displayName = 'Move';
    category = 'Default';

    getParams(): NodeParam[] {
        return [
            {
                name: 'mesh',
                val: '',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string'
                }
            },
            {
                name: 'move',
                val: 'forward',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string'
                }
            },
            {
                name: 'speed',
                val: 0.5,
                uiOptions: {
                    inputType: 'textField',
                    valueType: 'number'
                }
            }
        ];
    }

    getOutputLinks(): NodeLink[] {
        return [
            {
                name: 'animation'
            }
        ]
    }

    getInputLinks(): NodeLink[] {
        return [
            {
                name: 'input'
            }
        ];
    }

    getController(): FormController {
        const propControllers = [
            new MeshController(),
            new MeshMoveController(),
            new MeshSpeedController()
        ];

        return new FormController(undefined, this.registry, propControllers);
    }
    
    getExecutor(): INodeExecutor {
        return new MoveNodeExecutor(this.registry);
    }
}

export class MoveNodeExecutor implements INodeExecutor {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    execute(nodeObj: NodeObj) {
        const meshId = nodeObj.getParam('mesh').val;

        const meshView = this.registry.data.view.node.getById(meshId) as MeshView;

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

    defaultVal(context: PropContext, element: UI_InputElement) {
        return (context.registry.data.view.node.getById(element.targetId) as NodeView).getObj().getParam('move');
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

    defaultVal(context: PropContext, element: UI_InputElement) {
        return (context.registry.data.view.node.getById(element.targetId) as NodeView).getObj().getParam('speed');
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext, element: UI_InputElement) {
        const nodeObj = (context.registry.data.view.node.getById(element.targetId) as NodeView).getObj();
        nodeObj.setParam('speed', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}