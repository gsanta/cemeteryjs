import { NodeParam } from "../../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../../core/Registry";
import { AbstractNodeListener, INodeListener } from "../../../api/INodeListener";
import { AnimationGroupNodeParams } from "../AnimationGroupNode";

export class AnimationGroupNodeListener extends AbstractNodeListener {
    private params: AnimationGroupNodeParams;
    private registry: Registry;

    constructor(registry: Registry, params: AnimationGroupNodeParams) {
        super();
        this.registry = registry;
        this.params = params;
    }

    onNodeParamChange(param: NodeParam) {
        switch(param) {
            case this.params.signalStart:
                this.startAnimation();
            break;
            case this.params.signalStop:
                this.stopAnimation();
            break;
        }
    }

    private startAnimation() {
        const meshObj = this.params.mesh.getPortOrOwnVal();
        const animation = this.params.animation.ownVal;
        if (meshObj && animation) {
            this.registry.engine.animatons.startAnimation(meshObj, animation)
        }
    }

    private stopAnimation() {
        const meshObj = this.params.mesh.getPortOrOwnVal();
        const animation = this.params.animation.ownVal;
        if (meshObj && animation) {
            this.registry.engine.animatons.stopAnimation(meshObj, animation)
        }
    }
}