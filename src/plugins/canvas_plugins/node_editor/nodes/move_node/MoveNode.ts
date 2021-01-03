import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
import { INodeListener } from "../../node/INodeListener";
import { AbstractNodeFactory } from "../AbstractNode";
import { MeshMover } from "./MeshMover";
import { MoveNodeControllers } from "./MoveNodeControllers";

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

        const meshMover = new MeshMover();

        this.mesh = new MeshNodeParam(nodeObj, meshMover);
        this.key = new KeyboardNodeParam(nodeObj, 'key', this, meshMover);
        this.move = new MoveNodeParam(nodeObj, meshMover);
        this.speed = new SpeedNodeParam(nodeObj, meshMover);
    }

    readonly mesh: MeshNodeParam;
    readonly key: KeyboardNodeParam;
    readonly move: MoveNodeParam;
    readonly speed: SpeedNodeParam;
    
    readonly animation: NodeParam = {
        name: 'animation',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
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
        this.listener = new KeyboardListener(params, meshMover);
    }

    setVal(val: string) {
        this.val = val;
    }

    listener: INodeListener;
}

class KeyboardListener implements INodeListener {
    private keys: Set<string> = new Set();
    private moveNodeParams: MoveNodeParams;
    private meshMover: MeshMover;

    constructor(moveNodeParams: MoveNodeParams, meshMover: MeshMover) {
        this.moveNodeParams = moveNodeParams;
        this.meshMover = meshMover;
    }

    onKeyDown(e: IKeyboardEvent) {
        this.keys.add(String.fromCharCode(e.keyCode).toLocaleLowerCase());
    }

    onKeyUp(e: IKeyboardEvent) {
        this.keys.delete(String.fromCharCode(e.keyCode).toLocaleLowerCase());
        this.meshMover.reset();
    }

    onBeforeRender() {
        if (this.keys.has(this.moveNodeParams.key.val)) {
            this.meshMover.setMeshObj(this.moveNodeParams.mesh.getVal());
            this.meshMover.tick();
        }
    }
}