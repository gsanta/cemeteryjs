import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { getAllKeys } from "../../../../../core/services/input/KeyboardService";
import { NodeShape } from "../../models/shapes/NodeShape";
import { KeyboardNodeParams } from "../../models/nodes/KeyboardNode";
import { UIController } from "../../../../../core/controller/UIController";

export const KEY_REGEX = /key(\d*)/;

// const modifierKeys = [Keyboard.Shift[Keyboard.Shift], Keyboard.Ctrl[Keyboard.Ctrl]];

export class KeyboardNodeControllers extends UIController {

    constructor(registry: Registry, nodeView: NodeShape) {
        super();

        this.key = new KeyControl(registry, nodeView, 'key', getAllKeys());
        this.modifier = new KeyControl(registry, nodeView, 'modifier', ['Ctrl', 'Shift']);
    }

    key: KeyControl;
    modifier: KeyControl;
}

export class KeyControl extends ParamController {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<KeyboardNodeParams>;
    private paramName: string;
    private keys: string[] = [];

    constructor(registry: Registry, nodeView: NodeShape, paramName: string, keys: string[]) {
        super(registry);
        this.nodeObj = nodeView.getObj();
        this.paramName = paramName;
        this.keys = keys;
    }

    values() {
        return this.keys;
    }

    val() {
        return this.nodeObj.param[this.paramName].ownVal;
    }

    change(val) {
        this.nodeObj.param[this.paramName].ownVal = val;
        this.nodeObj.listener.onNodeParamChange(this.nodeObj.param.direction);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}