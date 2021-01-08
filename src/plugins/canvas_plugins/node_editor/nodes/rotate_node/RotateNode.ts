import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { INodeListener } from "../../node/INodeListener";
import { AbstractNodeFactory } from "../AbstractNode";
import { MeshNode } from "../mesh_node/MeshNode";
import { RotateNodeControllers } from "./RotateNodeControllers";

export const RotateNodeType = 'rotate-node-obj';

export class RotateNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RotateNodeType;
    displayName = 'Rotate';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RotateNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new RotateNodeParams(obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RotateNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();
        const rotator = new MeshRotator();
        this.key = new KeyboardNodeParam(nodeObj, 'key', this, rotator);
        this.mesh = new MeshNodeParam(nodeObj, rotator);
        this.rotate = new RotationNodeParam(nodeObj, rotator);
    }

    readonly key: KeyboardNodeParam;
    readonly mesh: MeshNodeParam;
    readonly rotate: RotationNodeParam;

    readonly input: NodeParam = {
        name: 'input',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
}

class MeshNodeParam extends NodeParam<MeshObj> {
    private meshRotator: MeshRotator;

    constructor(nodeObj: NodeObj, meshRotator: MeshRotator) {
        super(nodeObj);
        this.meshRotator = meshRotator;
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
        this.meshRotator.setMeshObj(val);
    }
}

class RotationNodeParam extends NodeParam {
    private meshRotator: MeshRotator;

    constructor(nodeObj: NodeObj, meshRotator: MeshRotator) {
        super(nodeObj);
        this.meshRotator = meshRotator;
        this.setVal(this.val as 'left');
    }
    
    name = 'rotate';
    field = NodeParamField.List;
    val = 'left';
    
    setVal(val: 'left' | 'right') {
        this.val = val;
        this.meshRotator.setDirection(val);
    }
}

class KeyboardNodeParam extends NodeParam {
    name: string;
    val = '';
    field = NodeParamField.List;

    constructor(nodeObj: NodeObj, name: string, params: RotateNodeParams, meshRotator: MeshRotator) {
        super(nodeObj);
        this.name = name;
        this.listener = new KeyboardListener(params, meshRotator);
    }

    setVal(val: string) {
        this.val = val;
    }

    listener: INodeListener;
}

class KeyboardListener implements INodeListener {
    private keys: Set<string> = new Set();
    private rotateNodeParams: RotateNodeParams;
    private meshRotator: MeshRotator;

    constructor(rotateNodeParams: RotateNodeParams, meshRotator: MeshRotator) {
        this.rotateNodeParams = rotateNodeParams;
        this.meshRotator = meshRotator;
    }

    onKeyDown(e: IKeyboardEvent) {
        this.keys.add(String.fromCharCode(e.keyCode).toLocaleLowerCase());
    }

    onKeyUp(e: IKeyboardEvent) {
        this.keys.delete(String.fromCharCode(e.keyCode).toLocaleLowerCase());
        this.meshRotator.reset();
    }

    onBeforeRender() {
        if (this.keys.has(this.rotateNodeParams.key.val)) {
            this.meshRotator.setMeshObj(this.rotateNodeParams.mesh.getVal());
            this.meshRotator.tick();
        }
    }
}

class MeshRotator {
    private time = undefined;
    private direction: 'left' | 'right';
    private meshObj: MeshObj;

    tick() {
        const currentTime = Date.now();
        if (this.time !== undefined) {
            this.rotate(currentTime - this.time);
        }
        this.time = currentTime;
    }

    reset() {
        this.time = undefined;
    }

    setMeshObj(meshObj: MeshObj) {
        this.meshObj = meshObj;
    }

    setDirection(dir: 'left' | 'right') {
        this.direction = dir;
    }

    private rotate(deltaTime: number) {
        const speed = deltaTime * 0.005;

        const rotation = this.meshObj.getRotation();
        if (this.direction === 'left') {
            this.meshObj.setRotation(new Point_3(rotation.x, rotation.y - speed, rotation.z));
        } else if (this.direction === 'right') {
            this.meshObj.setRotation(new Point_3(rotation.x, rotation.y + speed, rotation.z));
        }
    }
}
