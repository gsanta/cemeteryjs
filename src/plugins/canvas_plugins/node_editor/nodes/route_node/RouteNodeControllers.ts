import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { RouteNodeParams } from "./RouteNode";
import { RouteWalker } from "./RouteWalker";

export class RouteNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.speed = new SpeedControl(registry, nodeObj);
    }

    readonly speed: SpeedControl;
}

export class SpeedControl extends PropController<string> {
    private nodeObj: NodeObj<RouteNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal ? this.tempVal : this.nodeObj.param.speed.val;
    }
    
    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        try {
            const speedNum = parseFloat(this.tempVal);
            this.nodeObj.param.speed.val = speedNum;
        } finally {
            const routeWalker = this.nodeObj.param.routeWalker.val as RouteWalker;
            if (routeWalker) {
                routeWalker.setSpeed(this.nodeObj.param.speed.val);
            }
    
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Canvas1);
        }

    }
}
