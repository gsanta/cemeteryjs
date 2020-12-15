import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParam, NodeParamField, NodeParams, NodeParamRole, PortDirection, PortDataFlow } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshViewType } from "../../scene_editor/views/MeshView";
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
        nodeView.addParamController(new MeshController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<FilterMeshNodeParams>(this.nodeType, new FilterMeshNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
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
    
    readonly mesh: NodeParam = {
        name: 'mesh',
        field: NodeParamField.List,
    }
}

class OutputParam implements NodeParam {
    name = 'output'
    val = undefined
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Pull
    }

    getData(nodeObj: NodeObj, registry: Registry) {
        const port = nodeObj.getPort('input');
        if (port.hasConnectedPort()) {
            port.getConnectedPort().getNodeObj().pullData(port.getConnectedPort().getNodeParam().name);
        }

        const inputMesh = this.getMeshObjFromPort(nodeObj);
        const acceptedMesh = this.getMeshObjFromField(nodeObj, registry);

        if(inputMesh === acceptedMesh) {
            return inputMesh;
        } 
    }
    
    private getMeshObjFromPort(nodeObj: NodeObj): MeshObj {
        return nodeObj.pullData('input');
    }

    private getMeshObjFromField(nodeObj: NodeObj, registry: Registry): MeshObj {
        const meshId = nodeObj.param.mesh.val;
        if (meshId) {
            return <MeshObj> registry.data.view.scene.getById(meshId).getObj();
        }
    }
}