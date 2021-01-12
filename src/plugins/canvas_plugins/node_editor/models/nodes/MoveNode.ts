import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
import { INodeListener } from "../../api/INodeListener";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { MeshMover } from "../../domain/MeshMover";
import { MoveNodeControllers } from "../../controllers/nodes/MoveNodeControllers";
import { CollisionNodeParams, CollisionNodeType } from "./CollisionNode";
import { CollisionConstraint } from "../../domain/CollisionConstraint";

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
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

let id = 1;

export class MoveNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        const meshMover = new MeshMover((id++).toString());

        this.keyDown = new KeyDownParam(nodeObj, this, meshMover);
        this.keyUp = new KeyUpParam(nodeObj, this, meshMover);
        this.mesh = new MeshNodeParam(nodeObj, meshMover);
        this.key = new KeyboardNodeParam(nodeObj, 'key', this, meshMover);
        this.move = new MoveNodeParam(nodeObj, meshMover);
        this.speed = new SpeedNodeParam(nodeObj, meshMover);
        this.start = new StartNodeParam(nodeObj);
        this.stop = new StopNodeParam(nodeObj);
        this.collision = new CollisionParam(nodeObj, this, meshMover);
    }

    readonly keyDown: KeyDownParam;
    readonly keyUp: KeyUpParam;
    readonly mesh: MeshNodeParam;
    readonly key: KeyboardNodeParam;
    readonly move: MoveNodeParam;
    readonly speed: SpeedNodeParam;
    readonly start: NodeParam;
    readonly stop: NodeParam;
    readonly collision: NodeParam;
}

class KeyDownParam extends NodeParam {
    private meshMover: MeshMover;
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams, meshMover: MeshMover) {
        super(nodeObj);

        this.meshMover = meshMover;
        this.params = params;
    }
    
    name = 'keyDown';
    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Push
    }
    execute() {
        this.meshMover.start();
        this.params.start.callConnectedPorts();
    }
}

class KeyUpParam extends NodeParam {
    private meshMover: MeshMover;
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams, meshMover: MeshMover) {
        super(nodeObj);

        this.meshMover = meshMover;
        this.params = params;
    }

    name = 'keyUp';
    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Push
    };
    execute() {
        this.meshMover.stop();
        this.params.stop.callConnectedPorts();
    }
}

class CollisionParam extends NodeParam {
    private meshMover: MeshMover;
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams, meshMover: MeshMover) {
        super(nodeObj);

        this.meshMover = meshMover;
        this.params = params;

        this.meshMover.onMove(() => this.onMoveConstraint())
    }

    name = 'collision';
    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Pull
    };

    private onMoveConstraint(): boolean {
        const constraint = <CollisionConstraint> this.nodeObj.pullData('collision');
        const meshObj = this.params.mesh.val;

        if (constraint) {
            return constraint.isPositionValid(this.params.mesh.val);
            // constraint.isPositionValid()
        }

        return true;
    }
    execute() {
        this.meshMover.stop();
        this.params.stop.callConnectedPorts();
    }
}

class StartNodeParam extends NodeParam {
    name = 'start';
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Push
    }
}

class StopNodeParam extends NodeParam {
    name = 'stop';
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Push
    }
}

class MoveNodeParam extends NodeParam {
    private meshMover: MeshMover;

    constructor(nodeObj: NodeObj, meshMover: MeshMover) {
        super(nodeObj)
        this.meshMover = meshMover;
        this.setVal(this.val);
    }
    
    name = 'move'
    field = NodeParamField.List;
    val = MoveDirection.Forward;
    
    setVal(val: MoveDirection) {
        this.val = val;
        this.meshMover.setDirection(val);
    }
}

class SpeedNodeParam extends NodeParam {
    private meshMover: MeshMover;

    constructor(nodeObj: NodeObj, meshMover: MeshMover) {
        super(nodeObj);
        this.meshMover = meshMover;
        this.setVal(this.val);
    }
    
    name = 'speed';
    field = NodeParamField.NumberField;
    val = 0.5;
    
    setVal(val: number) {
        this.val = val;
        this.meshMover.setSpeed(val);
    }
}

class MeshNodeParam extends NodeParam<MeshObj> {
    private meshMover: MeshMover;

    constructor(nodeObj: NodeObj, meshMover: MeshMover) {
        super(nodeObj);
        this.meshMover = meshMover;
    }

    name = 'mesh';
    field = NodeParamField.List;
    val = undefined;

    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Pull
    };

    toJson() {
        return {
            name: this.name,
            field: this.field,
            val: this.val ? this.val.id : undefined
        }
    }

    fromJson(registry: Registry, nodeParamJson: NodeParamJson) {
        this.name = nodeParamJson.name;
        this.field = nodeParamJson.field;
        if (nodeParamJson.val) {
            this.setVal(<MeshObj> registry.stores.objStore.getById(nodeParamJson.val));
        }
    }

    setVal(val: MeshObj) {
        this.val = val;
        this.meshMover.setMeshObj(val);
    }
}

class KeyboardNodeParam extends NodeParam {
    name: string;
    val = '';
    field = NodeParamField.List;

    constructor(nodeObj: NodeObj, name: string, params: MoveNodeParams, meshMover: MeshMover) {
        super(nodeObj);
        this.name = name;
        this.listener = new KeyboardListener(params, meshMover, nodeObj);
    }

    setVal(val: string) {
        this.val = val;
    }

    listener: INodeListener;
}

class KeyboardListener implements INodeListener {
    private params: MoveNodeParams;
    private meshMover: MeshMover;
    private nodeObj: NodeObj;
    private isKeyDown: boolean = false;

    constructor(moveNodeParams: MoveNodeParams, meshMover: MeshMover, nodeObj: NodeObj) {
        this.params = moveNodeParams;
        this.meshMover = meshMover;
        this.nodeObj = nodeObj;
    }

    onKeyDown(e: IKeyboardEvent) {
        if (this.params.key.val === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.isKeyDown = true;
            this.params.start.callConnectedPorts();
        }
    }

    onKeyUp(e: IKeyboardEvent) {
        if (this.params.key.val === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.isKeyDown = false;
            this.meshMover.reset();
            this.params.stop.callConnectedPorts();
        }
    }

    onBeforeRender() {
        // if (this.isKeyDown) {
            this.meshMover.setMeshObj(this.params.mesh.getVal());
            this.meshMover.tick();
        // }
    }
}