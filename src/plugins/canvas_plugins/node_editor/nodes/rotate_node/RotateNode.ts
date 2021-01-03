import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { INodeListener } from "../../node/INodeListener";
import { AbstractNodeFactory } from "../AbstractNode";
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
        obj.executor = new RotateNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RotateNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();
        const rotator = new MeshRotator(nodeObj, this);
        this.key = new KeyboardNodeParam(nodeObj, 'key', this, rotator);
    }

    readonly key: KeyboardNodeParam;

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined
    }

    readonly rotate: NodeParam = {
        name: 'rotate',
        field: NodeParamField.List,
        val: 'left'
    }

    readonly input: NodeParam = {
        name: 'input',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
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
            this.meshRotator.tick();
        }
    }
}

export class RotateNodeExecutor extends AbstractNodeExecutor<RotateNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;
        if (meshObj) {
            const rotation = meshObj.getRotation();
            if (this.nodeObj.param.rotate.val === 'left') {
                meshObj.setRotation(new Point_3(rotation.x, rotation.y - Math.PI / 30, rotation.z));
            } else if (this.nodeObj.param.rotate.val === 'right') {
                meshObj.setRotation(new Point_3(rotation.x, rotation.y + Math.PI / 30, rotation.z));
            }
        }
    }
}

class MeshRotator {
    private time = undefined;
    private moveNodeParams: RotateNodeParams;
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj, moveNodeParams: RotateNodeParams) {
        this.moveNodeParams = moveNodeParams;
        this.nodeObj = nodeObj;
    }

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

    private rotate(deltaTime: number) {
        const meshObj = this.moveNodeParams.mesh.val; //getData(this.nodeObj);
        const speed = deltaTime * 0.001;

        const rotation = meshObj.getRotation();
        if (this.nodeObj.param.rotate.val === 'left') {
            meshObj.setRotation(new Point_3(rotation.x, rotation.y - speed, rotation.z));
        } else if (this.nodeObj.param.rotate.val === 'right') {
            meshObj.setRotation(new Point_3(rotation.x, rotation.y + speed, rotation.z));
        }
    }
}
