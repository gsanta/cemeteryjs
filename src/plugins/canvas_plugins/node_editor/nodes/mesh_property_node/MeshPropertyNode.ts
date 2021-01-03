import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamField } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { MeshViewType } from "../../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "../AbstractNode";
import { MeshPropertyNodeControllers } from "./MeshPropertyNodeControllers";

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

    readonly visible = {
        name: 'visible',
        field: NodeParamField.Checkbox,
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

        let meshObj: MeshObj;
        if (this.nodeObj.getPort('mesh').hasConnectedPort()) {
            meshObj = this.nodeObj.pullData('mesh');
        } else {
            meshObj = this.nodeObj.param.mesh.val;
        }

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    executeStop() {}
}