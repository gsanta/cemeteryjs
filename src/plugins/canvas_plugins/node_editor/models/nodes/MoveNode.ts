import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
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
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class MoveNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.mover.val = new MeshMover();

        this.keyDown = new KeyDownParam(nodeObj, this);
        this.keyUp = new KeyUpParam(nodeObj, this);
        this.mesh = new MeshNodeParam(nodeObj, this);
        this.key = new KeyboardNodeParam(nodeObj, 'key', this);
        this.move = new MoveNodeParam(nodeObj, this);
        this.speed = new SpeedNodeParam(nodeObj, this);
        this.start = new StartNodeParam(nodeObj);
        this.stop = new StopNodeParam(nodeObj);
        this.collision = new CollisionParam(nodeObj, this);
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
    readonly mover: NodeParam<MeshMover> = {
        name: 'mover',
        val: undefined,
        doNotSerialize: true
    }
}

class KeyDownParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }
    
    name = 'keyDown';
    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Push
    }
    execute() {
        this.params.mover.val.start();
        this.params.start.push();
    }
}

class KeyUpParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;
    }

    name = 'keyUp';
    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Push
    };
    execute() {
        this.params.mover.val.stop();
        this.params.stop.push();
    }
}

class CollisionParam extends NodeParam {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);

        this.params = params;

        this.params.mover.val.onMove(() => this.onMoveConstraint())
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
        this.params.mover.val.stop();
        this.params.stop.push();
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
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj)
        this.params = params;
        this.setVal(this.val);
    }
    
    name = 'move'
    field = NodeParamField.List;
    val = MoveDirection.Forward;
    
    setVal(val: MoveDirection) {
        this.val = val;
        this.params.mover.val.setDirections([val]);
    }
}

class SpeedNodeParam extends NodeParam {
    private params: MoveNodeParams;
    
    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);
        this.params = params;
        this.setVal(this.val);
    }
    
    name = 'speed';
    field = NodeParamField.NumberField;
    val = 0.5;
    
    setVal(val: number) {
        this.val = val;
        this.params.mover.val.setSpeed(val);
    }
}

class MeshNodeParam extends NodeParam<MeshObj> {
    private params: MoveNodeParams;

    constructor(nodeObj: NodeObj, params: MoveNodeParams) {
        super(nodeObj);
        this.params = params;
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
        this.params.mover.val.setMeshObj(val);
    }
}

class KeyboardNodeParam extends NodeParam {
    name: string;
    val = '';
    field = NodeParamField.List;

    constructor(nodeObj: NodeObj, name: string, params: MoveNodeParams) {
        super(nodeObj);
        this.name = name;
        this.listener = new KeyboardListener(params);
    }

    setVal(val: string) {
        this.val = val;
    }

    listener: INodeListener;
}

class KeyboardListener implements INodeListener {
    private params: MoveNodeParams;

    constructor(moveNodeParams: MoveNodeParams) {
        this.params = moveNodeParams;
    }

    onKeyDown(e: IKeyboardEvent) {
        if (this.params.key.val === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.params.start.push();
        }
    }

    onKeyUp(e: IKeyboardEvent) {
        if (this.params.key.val === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.params.mover.val.reset();
            this.params.stop.push();
        }
    }

    onBeforeRender() {
        this.params.mover.val.setMeshObj(this.params.mesh.getVal());
        this.params.mover.val.tick();
    }
}