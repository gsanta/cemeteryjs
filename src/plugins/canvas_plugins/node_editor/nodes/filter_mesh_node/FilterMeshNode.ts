import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamField, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeView } from "../../views/NodeView";
import { AbstractNodeFactory } from "../AbstractNode";
import { FilterMeshNodeControllers } from "./FilterMeshNodeControllers";

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

        this.output = new OutputParam(nodeObj);
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

class OutputParam extends NodeParam {
    constructor(nodeObj: NodeObj) {
        super(nodeObj);
    }

    name = 'output'
    val = undefined
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Pull
    }

    getVal(): MeshObj {
        const port = this.nodeObj.getPort('input');
        if (port.hasConnectedPort()) {
            port.getConnectedPorts()[0].getNodeObj().pullData(port.getConnectedPorts()[0].getNodeParam().name);
        }

        const inputMesh = this.nodeObj.pullData('input');
        const acceptedMeshes = this.nodeObj.param.mesh.val;

        if(acceptedMeshes.includes(inputMesh)) {
            return inputMesh;
        } 
    }
}