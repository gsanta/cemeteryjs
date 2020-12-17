import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParam, NodeParamField, NodeParams, PortDataFlow, PortDirection } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const MeshNodeType = 'mesh-node-obj';

export class FilterMeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
}

    nodeType = MeshNodeType;
    displayName = 'Filter Mesh';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<FilterMeshNodeParams>(this.nodeType, new FilterMeshNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type) ;
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class FilterMeshNodeParams extends NodeParams {

    constructor() {
        super();

        this.output = new OutputParam();
    }

    readonly input: NodeParam<MeshObj> = {
        name: 'input',
        val: undefined,
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Pull
        }
    }

    readonly output: NodeParam;
    
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined
    }
}

class OutputParam implements NodeParam {
    name = 'output'
    val = undefined
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Pull
    }

    getData(nodeObj: NodeObj<FilterMeshNodeParams>, registry: Registry): MeshObj {
        const port = nodeObj.getPort('input');
        if (port.hasConnectedPort()) {
            port.getConnectedPort().getNodeObj().pullData(port.getConnectedPort().getNodeParam().name);
        }

        const inputMesh = nodeObj.pullData('input');
        const acceptedMesh = nodeObj.param.mesh.val;

        if(inputMesh === acceptedMesh) {
            return inputMesh;
        } 
    }
}