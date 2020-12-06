import { NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshView } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const RotateNodeType = 'rotate-node-obj';

export class RotateNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RotateNodeType;
    displayName = 'Rotate';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView), new MeshRotateController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.executor = new RotateNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

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
                name: 'rotate',
                val: 'left',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string'
                }
            },
            {
                name: 'input',
                port: 'input'
            }
        ];
    }
}

export class RotateNodeExecutor implements INodeExecutor {
    private registry: Registry;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        this.registry = registry;
        this.nodeObj = nodeObj;
    }

    execute() {
        const meshId = this.nodeObj.getParam('mesh').val;

        const meshView = this.registry.data.view.scene.getById(meshId) as MeshView;
        const rotation = meshView.getObj().getRotation();
        if (this.nodeObj.getParam('rotate').val === 'left') {
            meshView.getObj().setRotation(new Point_3(rotation.x, rotation.y - Math.PI / 30, rotation.z));
        } else if (this.nodeObj.getParam('rotate').val === 'right') {
            meshView.getObj().setRotation(new Point_3(rotation.x, rotation.y + Math.PI / 30, rotation.z));
        }
    }

    executeStop() {}
}

export class MeshRotateController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['rotate']; }

    values() {
        return ['left', 'right'];
    }

    defaultVal() {
        return this.nodeView.getObj().getParam('rotate').val;
    }

    change(val, context) {
        context.updateTempVal(val);
        this.nodeView.getObj().setParam('rotate', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}