import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "./MeshNodeControllers";
import { AnimationNodeParams } from "../../models/nodes/AnimationNode";
import { UIController } from "../../../../../core/controller/UIController";

export class AnimationNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.move = new StartFrameController(registry, nodeObj);
        this.speed = new EndFrameController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly startFrame: StartFrameController;
    readonly endFrame: EndFrameController;
}

export class StartFrameController extends ParamController<string> {
    paramType = InputParamType.NumberField;
    private nodeObj: NodeObj<AnimationNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal ? this.tempVal : this.nodeObj.param.startFrame.ownVal;
    }

    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur() {
        try {
            const val = parseFloat(this.tempVal);
            this.nodeObj.param.startFrame.ownVal = val;
            this.tempVal = undefined;
        } finally {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRenderAll();
        }
    }
}

export class EndFrameController extends ParamController<string> {
    paramType = InputParamType.NumberField;
    private nodeObj: NodeObj<AnimationNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal ? this.tempVal : this.nodeObj.param.endFrame.ownVal;
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);        
    }

    blur() {
        try {
            const val = parseFloat(this.tempVal);
            this.nodeObj.param.endFrame.ownVal = val;
            this.tempVal = undefined;
        } finally {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRenderAll();
        }
    }
}