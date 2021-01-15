import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { RouteNodeParams } from "../../models/nodes/RouteNode";
import { RouteWalker } from "../../domain/RouteWalker";
import { UIController } from "../../../../../core/controller/UIController";

export class RouteNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.speed = new SpeedControl(registry, nodeObj);
    }

    readonly speed: SpeedControl;
}

export class SpeedControl extends ParamController<string> {
    paramType = InputParamType.NumberField;
    private nodeObj: NodeObj<RouteNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal ? this.tempVal : this.nodeObj.param.speed.ownVal;
    }
    
    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        try {
            const speedNum = parseFloat(this.tempVal);
            this.nodeObj.param.speed.ownVal = speedNum;
        } finally {
            const routeWalker = this.nodeObj.param.routeWalker.ownVal as RouteWalker;
            if (routeWalker) {
                routeWalker.setSpeed(this.nodeObj.param.speed.ownVal);
            }
    
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Canvas1);
        }

    }
}
