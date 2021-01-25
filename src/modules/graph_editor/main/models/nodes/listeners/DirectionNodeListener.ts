import { NodeParam } from "../../../../../../core/models/objs/node_obj/NodeParam";
import { AbstractNodeListener, INodeListener } from "../../../api/INodeListener";
import { DirectionNodeParams } from "../DirectionNode";

export class DirectionNodeListener extends AbstractNodeListener {
    private params: DirectionNodeParams;

    constructor(params: DirectionNodeParams) {
        super();
        this.params = params;
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.on:
            case this.params.direction:
                if (this.params.on.getPortOrOwnVal() === true) {
                    this.params.dirOrUndef.ownVal = this.params.direction.ownVal;
                } else {
                    this.params.dirOrUndef.ownVal = undefined;
                }
            break;
        }

        this.params.dirOrUndef.getHandler().push();
    }
}