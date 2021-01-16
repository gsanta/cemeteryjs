import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeView } from "../views/NodeView";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { FilterMeshNodeControllers } from "../../controllers/nodes/FilterMeshNodeControllers";

export const FilterMeshNodeType = 'filter-mesh-node-obj';

export class FilterMeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
}

    nodeType = FilterMeshNodeType;
    displayName = 'Filter Mesh';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new FilterMeshNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<FilterMeshNodeParams>(this.nodeType, {displayName: this.displayName});
        obj.setParams(new FilterMeshNodeParams(obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type) ;
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class FilterMeshNodeParams extends NodeParams {
    constructor(nodeObj: NodeObj) {
        super();

        this.output = new OutputParam(nodeObj, this);
    }

    readonly input: NodeParam<MeshObj> = {
        name: 'input',
        ownVal: undefined,
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Pull
    }

    readonly output: NodeParam;
    
    readonly mesh: NodeParam<MeshObj[]> = {
        name: 'mesh',
        ownVal: [],
        toJson: () => {
            const val = this.mesh.ownVal.map(meshObj => meshObj.id).join(', ');
            return {
                name: this.mesh.name,
                val: val
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            const ids = (nodeParamJson.val as string).split(', ');
            const meshObjs = <MeshObj[]> ids.map(id => registry.stores.objStore.getById(id));
            this.mesh.name = nodeParamJson.name;
            this.mesh.ownVal = meshObjs;
        }
    }
}

class OutputParam extends NodeParam {
    private params: FilterMeshNodeParams;

    constructor(nodeObj: NodeObj, params: FilterMeshNodeParams) {
        super(nodeObj);
        this.params = params;
    }

    name = 'output'
    ownVal = undefined
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Pull;

    onPull(): MeshObj {
        this.portVal
        const inputMesh = this.params.input.getPortOrOwnVal();
        const acceptedMeshes = this.nodeObj.param.mesh.val;

        if(acceptedMeshes.includes(inputMesh)) {
            return inputMesh;
        } 
    }
}