import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection, PortValueType } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/controller/KeyboardHandler";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { AbstractNodeListener } from "../../api/INodeListener";
import { RotateNodeControllers } from "../../controllers/nodes/RotateNodeControllers";
import { NodeShape } from "../shapes/NodeShape";
import { MeshNodeParam, MoveDirection } from "./MoveNode";

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

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RotateNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new RotateNodeParams(obj));
        obj.listener = new RotateNodeListener(obj.param, new MeshRotator());
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RotateNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();
        this.on = new OnNodeParam(nodeObj);
        this.mesh = new MeshNodeParam(nodeObj);
        this.direction = new DirectionNodeParam(nodeObj);
        this.key = new KeyboardNodeParam(nodeObj);
    }

    readonly on: OnNodeParam;
    readonly mesh: MeshNodeParam;
    readonly direction: DirectionNodeParam;
    readonly key: KeyboardNodeParam;
}

class OnNodeParam extends NodeParam<boolean> {
    name = 'on';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    portValueType = PortValueType.Boolean;
}

class DirectionNodeParam extends NodeParam<MoveDirection[]> {

    constructor(nodeObj: NodeObj) {
        super(nodeObj)
    }
    
    name = 'direction'
    ownVal = [MoveDirection.Left];

    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}

class KeyboardNodeParam extends NodeParam {
    name: string = 'key';
    ownVal = '';
}

// export class RotateNodeListener implements INodeListener {
//     private params: RotateNodeParams;
//     private nodeObj: NodeObj;
//     private meshRotator: MeshRotator;

//     constructor(nodeObj: NodeObj, moveNodeParams: RotateNodeParams, meshRotator: MeshRotator) {
//         this.params = moveNodeParams;
//         this.nodeObj = nodeObj;
//         this.meshRotator = meshRotator;
//     }

//     onKeyDown(e: IKeyboardEvent) {
//         if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
//             this.nodeObj.getPortForParam(this.params.start).push();
//         }
//     }

//     onKeyUp(e: IKeyboardEvent) {
//         if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
//             this.params.mover.ownVal.reset();
//             this.nodeObj.getPortForParam(this.params.stop).push();
//         }
//     }

//     onBeforeRender() {
//         this.params.mover.ownVal.setMeshObj(this.params.mesh.getPortOrOwnVal());
//         this.params.mover.ownVal.tick();
//     }

//     onNodeParamChange(param: NodeParam) {
//         switch(param) {
//             case this.params.direction:
//             case this.params.checkChange:
//                 this.params.mover.ownVal.setDirections(this.params.direction.getPortOrOwnVal());
//             break;
//             case this.params.on:
//                 if (this.params.on.getPortOrOwnVal() === true) {
//                     this.params.mover.ownVal.start();
//                 } else {
//                     this.meshRotator.stop();
//                 }
//             break;
//         }
//     }

//     onInit() {
//         this.meshRotator.setDirection(this.params.direction.getPortOrOwnVal());
//         this.meshRotator.setMeshObj(this.params.mesh.getPortOrOwnVal());
//         // this.params.mover.owv)
//     }
// }

class RotateNodeListener extends AbstractNodeListener {
    private keys: Set<string> = new Set();
    private params: RotateNodeParams;
    private meshRotator: MeshRotator;

    constructor(params: RotateNodeParams, meshRotator: MeshRotator) {
        super();
        this.params = params;
        this.meshRotator = meshRotator;
    }

    onKeyDown(e: IKeyboardEvent) {
        if (String.fromCharCode(e.keyCode) === this.params.key.ownVal) {
            this.meshRotator.start();
        }
    }

    onKeyUp(e: IKeyboardEvent) {
        if (String.fromCharCode(e.keyCode) === this.params.key.ownVal) {
            this.meshRotator.stop();
        }
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.direction:
                this.meshRotator.setDirections(this.params.direction.getPortOrOwnVal());
            break;
            case this.params.mesh:
                this.meshRotator.setMeshObj(this.params.mesh.getPortOrOwnVal())
            break;
            case this.params.on:
                if (this.params.on.getPortOrOwnVal() === true) {
                    this.meshRotator.start();
                } else {
                    this.meshRotator.stop();
                }
            break;
        }
    }

    onBeforeRender() {
        this.meshRotator.setMeshObj(this.params.mesh.getPortOrOwnVal());
        this.meshRotator.tick();
    }
}

class MeshRotator {
    private time = undefined;
    private directions: MoveDirection[] = [];
    private meshObj: MeshObj;
    private isStopped = true;

    tick() {
        if (this.isStopped || this.meshObj === undefined) {
            return;
        }

        const currentTime = Date.now();
        if (this.time !== undefined) {
            this.rotate(currentTime - this.time);
        }
        this.time = currentTime;
    }

    stop() {
        this.isStopped = true;
        this.reset();
    }

    start() {
        this.isStopped = false;
    }

    reset() {
        this.time = undefined;
    }

    setMeshObj(meshObj: MeshObj) {
        this.meshObj = meshObj;
    }

    setDirections(directions: MoveDirection[]) {
        this.directions = directions;
    }

    private rotate(deltaTime: number) {
        const speed = deltaTime * 0.005;

        const rotation = this.meshObj.getRotation();
        if (this.directions.includes(MoveDirection.Left)) {
            this.meshObj.setRotation(new Point_3(rotation.x, rotation.y - speed, rotation.z));
        }
        
        if (this.directions.includes(MoveDirection.Right)) {
            this.meshObj.setRotation(new Point_3(rotation.x, rotation.y + speed, rotation.z));
        }
    }
}
