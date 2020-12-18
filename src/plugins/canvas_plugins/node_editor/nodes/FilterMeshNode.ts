import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamField, NodeParamJson } from "../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeFactory } from "./AbstractNode";
import { MultiMeshController } from "./MeshNode";

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
        nodeView.addParamController(new MultiMeshController(this.registry, nodeView.getObj()));
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
    
    readonly mesh: NodeParam<MeshObj[]> = {
        name: 'mesh',
        field: NodeParamField.MultiList,
        val: [],
        toJson: () => {
            const val = this.mesh.val.map(meshObj => meshObj.id).join(', ');
            return {
                name: this.mesh.name,
                field: this.mesh.field,
                val: val
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            const ids = (nodeParamJson.val as string).split(', ');
            const meshObjs = <MeshObj[]> ids.map(id => registry.stores.objStore.getById(id));
            this.mesh.name = nodeParamJson.name;
            this.mesh.field = nodeParamJson.field
            this.mesh.val = meshObjs;
        }
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