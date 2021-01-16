import { NodeObj } from "../../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam } from "../../../../../../core/models/objs/node_obj/NodeParam";
import { IKeyboardEvent } from "../../../../../../core/services/input/KeyboardService";
import { INodeListener } from "../../../api/INodeListener";
import { MoveNodeParams } from "../MoveNode";

export class MoveNodeListener implements INodeListener {
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
            case this.params.on:
                if (this.params.on.getPortOrOwnVal() === true) {
                    this.params.mover.ownVal.start();
                } else {
                    this.params.mover.ownVal.stop();
                }
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