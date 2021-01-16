import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeView } from "../views/NodeView";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { AnimationGroupNodeControllers } from "../../controllers/nodes/AnimationGroupNodeControllers";

export const RemoveMeshNodeType = 'animation-group-node-obj';

export class AnimationGroupNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Animation Group';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new AnimationGroupNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new AnimationGroupNodeParams(this.registry, obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class AnimationGroupNodeParams extends NodeParams {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.signalStart = new SignalStartNode(registry, this, nodeObj);
        this.signalStop = new SignalStopNode(registry, this, nodeObj);
    }

    readonly signalStart: NodeParam;
    readonly signalStop: NodeParam;

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        ownVal: undefined,
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Pull,
        toJson: () => {
            return {
                name: this.mesh.name,
                val: this.mesh.ownVal ? this.mesh.ownVal.id : undefined
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            this.mesh.ownVal = <MeshObj> registry.stores.objStore.getById(nodeParamJson.val);
        },
    }

    readonly animation: NodeParam<string> = {
        name: 'animation',
        ownVal: undefined,
        toJson() {
            return {
                name: this.name,
                field: this.field,
                val: this.ownVal
            }
        },
        fromJson(registry: Registry, nodeParamJson: NodeParamJson) {
            this.ownVal = nodeParamJson.val;
        },
    }
}

class SignalStartNode extends NodeParam {
    private registry: Registry;
    private params: AnimationGroupNodeParams;

    constructor(registry: Registry, params: AnimationGroupNodeParams, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
        this.params = params;
        this.nodeObj = nodeObj;
    }

    name = 'signalStart';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;

    execute() {
        const meshObj = this.params.mesh.getPortOrOwnVal();
        const animation = this.params.animation.ownVal;
        if (meshObj && animation) {
            this.registry.engine.animatons.startAnimation(meshObj, animation)
        }
    }
}

class SignalStopNode extends NodeParam {
    private registry: Registry;
    private params: AnimationGroupNodeParams;

    constructor(registry: Registry, params: AnimationGroupNodeParams, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
        this.params = params;
        this.nodeObj = nodeObj;
    }

    name = 'signalStop';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;

    execute() {
        const meshObj = this.params.mesh.getPortOrOwnVal();
        const animation = this.params.animation.ownVal;
        if (meshObj && animation) {
            this.registry.engine.animatons.stopAnimation(meshObj, animation)
        }
    }
}