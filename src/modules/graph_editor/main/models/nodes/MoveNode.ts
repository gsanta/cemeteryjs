import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamJson, PortDataFlow, PortDirection, PortValueType } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { INodeListener } from "../../api/INodeListener";
import { MoveNodeControllers } from "../../controllers/nodes/MoveNodeControllers";
import { CollisionConstraint } from "../../controllers/domain/CollisionConstraint";
import { MeshMover } from "../../controllers/domain/MeshMover";
import { NodeShape } from "../shapes/NodeShape";
import { MoveNodeListener } from "./listeners/MoveNodeListener";

export const MoveNodeType = 'move-node-obj';

export enum MoveDirection {
    Forward = 'forward',
    Backward = 'backward',
    Left = 'left',
    Right = 'right'
}

export class MoveNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MoveNodeType;
    displayName = 'Move';
    category = 'Default';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new MoveNodeControllers(this.registry, obj))
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new MoveNodeParams(obj));
        obj.listener = new MoveNodeListener(obj, obj.param);
        obj.listener.onInit();
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class MoveNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.mover.ownVal = new MeshMover();

        this.on = new OnNodeParam(nodeObj, this);
        this.mesh = new MeshNodeParam(nodeObj);
        this.key = new KeyboardNodeParam(nodeObj);
        this.direction = new DirectionNodeParam(nodeObj);
        this.speed = new SpeedNodeParam(nodeObj);
        this.start = new StartNodeParam(nodeObj);
        this.stop = new StopNodeParam(nodeObj);
        this.collision = new CollisionParam(nodeObj, this);
    }

    readonly on: OnNodeParam;
    readonly mesh: MeshNodeParam;
    readonly key: KeyboardNodeParam;
    readonly direction: DirectionNodeParam;
    readonly speed: SpeedNodeParam;
    readonly start: NodeParam;
    readonly stop: NodeParam;
    readonly collision: NodeParam;

    readonly mover: NodeParam<MeshMover> = {
        name: 'mover',
        ownVal: undefined,
        doNotSerialize: true
    }
}

class OnNodeParam extends NodeParam<boolean> {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'on';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    portValueType = PortValueType.Boolean;
    execute() {
        // this.params.mover.ownVal.start();
        this.nodeObj.getPortForParam(this.params.start).push();
    }
}

class CollisionParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;

        this.params.mover.ownVal.onMove(() => this.onMoveConstraint())
    }

    name = 'collision';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Pull;

    private onMoveConstraint(): boolean { 
        const constraint = <CollisionConstraint> this.params.collision.getPortOrOwnVal();

        if (constraint) {
            return constraint.isPositionValid(this.params.mesh.ownVal);
            // constraint.isPositionValid()
        }

        return true;
    }
    execute() {
        this.params.mover.ownVal.stop();
        this.nodeObj.getPortForParam(this.params.stop).push();
    }
}

class StartNodeParam extends NodeParam {
    name = 'start';
    portDirection = PortDirection.Output;
    portDataFlow =  PortDataFlow.Push;
}

class StopNodeParam extends NodeParam {
    name = 'stop';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

class DirectionNodeParam extends NodeParam<MoveDirection[]> {

    constructor(nodeObj: NodeObj) {
        super(nodeObj)
    }
    
    name = 'direction'
    ownVal = [MoveDirection.Forward];

    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}

class SpeedNodeParam extends NodeParam {
    name = 'speed';
    ownVal = 0.5;
}

export class MeshNodeParam extends NodeParam<MeshObj> {
    name = 'mesh';
    ownVal = undefined;

    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Pull;
    portValueType = PortValueType.GameObject;

    toJson() {
        return {
            name: this.name,
            val: this.ownVal ? this.ownVal.id : undefined
        }
    }

    fromJson(registry: Registry, nodeParamJson: NodeParamJson) {
        this.name = nodeParamJson.name;
        if (nodeParamJson.val) {
            this.ownVal = <MeshObj> registry.data.scene.items.getItemById(nodeParamJson.val);
        }
    }
}

class KeyboardNodeParam extends NodeParam {
    name: string;
    ownVal = 'key';
}