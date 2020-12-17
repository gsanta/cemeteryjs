import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParam, NodeParamField, NodeParams, NodeParamRole, PortDataFlow, PortDirection } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshViewType } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const RemoveMeshNodeType = 'remove-mesh-node-obj';

export class RemoveMeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Remove Mesh';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new RemoveMeshNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.executor = new RemoveMeshNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class RemoveMeshNodeParams extends NodeParams {
    readonly action: NodeParam = {
        name: 'action',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly signal: NodeParam = {
        name: 'signal',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Pull
        }
    }
}

export class RemoveMeshNodeExecutor extends AbstractNodeExecutor<RemoveMeshNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        let meshObj: MeshObj;
        if (this.nodeObj.getPort('mesh').hasConnectedPort()) {
            meshObj = this.registry.services.node.pullData(this.nodeObj, 'mesh');
        } else {
            meshObj = this.nodeObj.param.mesh.val;
        }

        if (meshObj) {
            this.registry.stores.objStore.removeObj(meshObj);
        }
    }
    
    executeStop() {}
}