import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { NodeView } from "../views/NodeView";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { MeshPropertyNodeControllers } from "../../controllers/nodes/MeshPropertyNodeControllers";

export const MeshPropertyNodeType = 'mesh-property-node-obj';

export class MeshPropertyNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MeshPropertyNodeType;
    displayName = 'Mesh Property';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new MeshPropertyNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new MeshPropertyNodeParams());
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.executor = new MeshPropertyNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class MeshPropertyNodeParams extends NodeParams {    
    readonly signal: NodeParam = {
        name: 'signal',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        ownVal: undefined,
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Pull
    }

    readonly visible = {
        name: 'visible',
        val: 1,
    }
}

export class MeshPropertyNodeExecutor extends AbstractNodeExecutor<MeshPropertyNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const visibility: number = this.nodeObj.param.visible.val;

        let meshObj: MeshObj = this.nodeObj.getPort('mesh').getNodeParam().getPortOrOwnVal();

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    executeStop() {}
}