import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent, Keyboard } from "../../../../../core/services/input/KeyboardService";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { INodeListener } from "../../api/INodeListener";
import { MoveNodeControllers } from "../../controllers/nodes/MoveNodeControllers";
import { CollisionConstraint } from "../../domain/CollisionConstraint";
import { MeshMover } from "../../domain/MeshMover";
import { NodeView } from "../views/NodeView";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new MoveNodeControllers(this.registry, obj))
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new MoveNodeParams(obj));
        obj.listener = new KeyboardListener(obj, obj.param);
        obj.listener.onInit();
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class MoveNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.mover.ownVal = new MeshMover();

        this.keyDown = new KeyDownParam(nodeObj, this);
        this.keyUp = new KeyUpParam(nodeObj, this);
        this.checkChange = new CheckChange(nodeObj, this);
        this.removeDir = new RemoveDirectionParam(nodeObj, this);
        this.mesh = new MeshNodeParam(nodeObj, this);
        this.key = new KeyboardNodeParam(nodeObj, 'key', this);
        this.direction = new DirectionNodeParam(nodeObj, this);
        this.speed = new SpeedNodeParam(nodeObj, this);
        this.start = new StartNodeParam(nodeObj);
        this.stop = new StopNodeParam(nodeObj);
        this.collision = new CollisionParam(nodeObj, this);
    }

    readonly keyDown: KeyDownParam;
    readonly keyUp: KeyUpParam;
    readonly mesh: MeshNodeParam;
    readonly key: KeyboardNodeParam;
    readonly direction: DirectionNodeParam;
    readonly speed: SpeedNodeParam;
    readonly start: NodeParam;
    readonly stop: NodeParam;
    readonly collision: NodeParam;
    readonly checkChange: CheckChange;
    readonly removeDir: RemoveDirectionParam;

    readonly mover: NodeParam<MeshMover> = {
        name: 'mover',
        ownVal: undefined,
        doNotSerialize: true
    }
}

class CheckChange extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'checkChange';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    execute() {
        // this.params.mover.ownVal.setDirections(this.params.direction.getPortOrOwnVal());
        // this.params.mover.ownVal.start();
        // this.nodeObj.getPortForParam(this.params.start).push();
    }
}

class RemoveDirectionParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'removeDir';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    execute() {
        // this.params.mover.ownVal.start();
        // this.nodeObj.getPortForParam(this.params.start).push();
    }
}

class KeyDownParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'keyDown';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    execute() {
        this.params.mover.ownVal.start();
        this.nodeObj.getPortForParam(this.params.start).push();
    }
}

class KeyUpParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }

    name = 'keyUp';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    execute() {
        this.params.mover.ownVal.stop();
        this.nodeObj.getPortForParam(this.params.stop).push();
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
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj)
        this.params = params;
    }
    
    name = 'direction'
    ownVal = [MoveDirection.Forward];

    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}

class SpeedNodeParam extends NodeParam {
    private params: MoveNodeParams;
    
    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);
        this.params = params;
        this.setVal(this.ownVal);
    }
    
    name = 'speed';
    ownVal = 0.5;
    
    setVal(val: number) {
        this.ownVal = val;
        this.params.mover.ownVal.setSpeed(val);
    }
}

class MeshNodeParam extends NodeParam<MeshObj> {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);
        this.params = params;
    }

    name = 'mesh';
    ownVal = undefined;

    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Pull;

    toJson() {
        return {
            name: this.name,
            val: this.ownVal ? this.ownVal.id : undefined
        }
    }

    fromJson(registry: Registry, nodeParamJson: NodeParamJson) {
        this.name = nodeParamJson.name;
        if (nodeParamJson.val) {
            this.setVal(<MeshObj> registry.stores.objStore.getById(nodeParamJson.val));
        }
    }

    setVal(val: MeshObj) {
        this.ownVal = val;
        this.params.mover.ownVal.setMeshObj(val);
    }
}

class KeyboardNodeParam extends NodeParam {
    name: string;
    ownVal = '';

    constructor(nodeObj: NodeObj, name: string, params: MoveNodeParams) {
        super(nodeObj);
        this.name = name;
        this.listener = new KeyboardListener(nodeObj, params);
    }

    setVal(val: string) {
        this.ownVal = val;
    }

    listener: INodeListener;
}

class KeyboardListener implements INodeListener {
    private params: MoveNodeParams;
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj, moveNodeParams: MoveNodeParams) {
        this.params = moveNodeParams;
        this.nodeObj = nodeObj;
    }

    onKeyDown(e: IKeyboardEvent) {
        if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.nodeObj.getPortForParam(this.params.start).push();
        }
    }

    onKeyUp(e: IKeyboardEvent) {
        if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.params.mover.ownVal.reset();
            this.nodeObj.getPortForParam(this.params.stop).push();
        }
    }

    onBeforeRender() {
        this.params.mover.ownVal.setMeshObj(this.params.mesh.getPortOrOwnVal());
        this.params.mover.ownVal.tick();
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.direction:
            case this.params.checkChange:
                this.params.mover.ownVal.setDirections(this.params.direction.getPortOrOwnVal());
            break;
        }
    }

    onInit() {
        const mover = this.params.mover.ownVal;

        mover.setDirections(this.params.direction.getPortOrOwnVal());
        mover.setSpeed(this.params.speed.ownVal);
        mover.setMeshObj(this.params.mesh.ownVal);
        // this.params.mover.owv)
    }
}