import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { AbstractNodeFactory } from "../AbstractNode";
import { RotateNodeControllers } from "./RotateNodeControllers";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RotateNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new RotateNodeParams(), {displayName: this.displayName});
        
        obj.executor = new RotateNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RotateNodeParams extends NodeParams {
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined
    }

    readonly rotate: NodeParam = {
        name: 'rotate',
        field: NodeParamField.List,
        val: 'left'
    }

    readonly input: NodeParam = {
        name: 'input',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
}

export class RotateNodeExecutor extends AbstractNodeExecutor<RotateNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;
        if (meshObj) {
            const rotation = meshObj.getRotation();
            if (this.nodeObj.param.rotate.val === 'left') {
                meshObj.setRotation(new Point_3(rotation.x, rotation.y - Math.PI / 30, rotation.z));
            } else if (this.nodeObj.param.rotate.val === 'right') {
                meshObj.setRotation(new Point_3(rotation.x, rotation.y + Math.PI / 30, rotation.z));
            }
        }
    }
}