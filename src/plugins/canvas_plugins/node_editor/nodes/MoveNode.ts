import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { MeshView } from "../../scene_editor/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { NodeRenderer } from "../NodeRenderer";
import { AbstractNode } from "./AbstractNode";
import { MeshController } from "./MeshNode";

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

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView), new MeshMoveController(nodeView), new MeshSpeedController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputLinks();
        obj.outputs = this.getOutputLinks();
        obj.executor = new MoveNodeExecutor(this.registry);
        obj.id = this.registry.stores.objStore.generateId(obj.type);

        return obj;
    }

    private getParams(): NodeParam[] {
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

    private getOutputLinks(): NodeLink[] {
        return [
            {
                name: 'animation'
            }
        ]
    }

    private getInputLinks(): NodeLink[] {
        return [
            {
                name: 'input'
            }
        ];
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
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['move']; }

    values() {
        return ['forward', 'backward'];
    }

    defaultVal() {
        return this.nodeView.getObj().getParam('move');
    }

    change(val, context) {
        context.updateTempVal(val);
        this.nodeView.getObj().setParam('move', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['speed']; }

    defaultVal() {
        return this.nodeView.getObj().getParam('speed');
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        const nodeObj = this.nodeView.getObj();
        nodeObj.setParam('speed', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}