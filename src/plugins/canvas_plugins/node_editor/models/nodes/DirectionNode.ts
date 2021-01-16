import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { INodeListener } from "../../api/INodeListener";
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
        obj.listener = new DirectionNodeListener(obj, obj.param);
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
        this.signalChange = new SignalChange(nodeObj, this);
        this.dirOrUndef = new DirectionOrUndef(nodeObj, this);
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
    readonly signalChange: SignalChange;
    readonly dirOrUndef: DirectionOrUndef;
    readonly isOn: IsOnNodeParam;
    readonly direction: DirectionNodeParam;

    readonly state: NodeParam<boolean> = {
        name: 'state',
        doNotSerialize: true,
        ownVal: false
    }
    // readonly mesh: MeshNodeParam;
    // readonly key: KeyboardNodeParam;
    // readonly move: MoveNodeParam;
    // readonly speed: SpeedNodeParam;
    // readonly start: NodeParam;
    // readonly stop: NodeParam;
    // readonly collision: NodeParam;
}


class SignalChange extends NodeParam {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'signalChange';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

class DirectionOrUndef extends NodeParam<MoveDirection> {
    private params: DirectionNodeParams;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        super(nodeObj);

        this.params = params;
    }

    name = 'dirOrUndef';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
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
        this.params.state.ownVal = true;
        this.params.signalChange.getHandler().push();
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
        this.params.state.ownVal = false;
        this.params.signalChange.getHandler().push();
        // this.params.isOn.ownVal = undefined;
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

class DirectionNodeListener implements INodeListener {
    private params: DirectionNodeParams;
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj, params: DirectionNodeParams) {
        this.params = params;
        this.nodeObj = nodeObj;
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.on:
            case this.params.direction:
                this.params.dirOrUndef.ownVal = this.params.direction.ownVal;
            break;
            case this.params.off:
                this.params.dirOrUndef.ownVal = undefined;
            break;
        }

        this.params.dirOrUndef.getHandler().push();
    }

    onInit() {
        const mover = this.params.mover.ownVal;

        mover.setDirections(this.params.direction.getPortOrOwnVal());
        mover.setSpeed(this.params.speed.ownVal);
        mover.setMeshObj(this.params.mesh.ownVal);
        // this.params.mover.owv)
    }
}