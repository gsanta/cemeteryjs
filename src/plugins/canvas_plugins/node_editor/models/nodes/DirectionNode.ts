import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { DirectionNodeControllers } from "../../controllers/nodes/DirectionNodeControllers";
import { NodeView } from "../views/NodeView";
import { MoveDirection } from "./MoveNode";

export const DirectionNodeType = 'direction-node-obj';

export class DirectionNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = DirectionNodeType;
    displayName = 'Direction';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new DirectionNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new DirectionNodeParams(obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class DirectionNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.on = new OnNodeParam(nodeObj, this);
        this.off = new OffNodeParam(nodeObj, this);
        this.isOn = new IsOnNodeParam(nodeObj, this);
        this.direction = new DirectionNodeParam(nodeObj);
        // this.mesh = new MeshNodeParam(nodeObj, meshMover);
        // this.key = new KeyboardNodeParam(nodeObj, 'key', this, meshMover);
        // this.move = new MoveNodeParam(nodeObj, meshMover);
        // this.speed = new SpeedNodeParam(nodeObj, meshMover);
        // this.start = new StartNodeParam(nodeObj);
        // this.stop = new StopNodeParam(nodeObj);
        // this.collision = new CollisionParam(nodeObj, this, meshMover);
    }

    readonly on: OnNodeParam;
    readonly off: OffNodeParam;
    readonly isOn: IsOnNodeParam;
    readonly direction: DirectionNodeParam;
    // readonly mesh: MeshNodeParam;
    // readonly key: KeyboardNodeParam;
    // readonly move: MoveNodeParam;
    // readonly speed: SpeedNodeParam;
    // readonly start: NodeParam;
    // readonly stop: NodeParam;
    // readonly collision: NodeParam;
}

class OnNodeParam extends NodeParam {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'on';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    execute() {
        this.params.isOn.ownVal = this.params.direction.ownVal;
        // this.meshMover.start();
        // this.params.start.callConnectedPorts();
    }
}

class OffNodeParam extends NodeParam {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }

    name = 'off';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    execute() {
        this.params.isOn.ownVal = undefined;
        // this.meshMover.stop();
        // this.params.stop.callConnectedPorts();
    }
}

class IsOnNodeParam extends NodeParam<MoveDirection> {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }

    name = 'isOn';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Pull;
    ownVal: undefined
    execute() {
        // this.meshMover.stop();
        // this.params.stop.callConnectedPorts();
    }
}

class DirectionNodeParam extends NodeParam {
    constructor(nodeObj: NodeObj) {
        super(nodeObj)
        this.setVal(this.ownVal);
    }
    
    name = 'direction'
    ownVal = undefined;
    
    setVal(val: MoveDirection) {
        this.ownVal = val;
    }
}