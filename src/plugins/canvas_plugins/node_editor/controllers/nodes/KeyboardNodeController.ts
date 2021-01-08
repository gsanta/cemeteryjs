import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { getAllKeys } from "../../../../../core/services/input/KeyboardService";
import { NodeView } from "../../models/views/NodeView";
import { KeyboardNodeParams } from "../../models/nodes/KeyboardNode";

export const KEY_REGEX = /key(\d*)/;

// const modifierKeys = [Keyboard.Shift[Keyboard.Shift], Keyboard.Ctrl[Keyboard.Ctrl]];

export class KeyboardNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeView: NodeView) {
        super();

        this.key = new KeyControl(registry, nodeView, 'key', getAllKeys());
        this.modifier = new KeyControl(registry, nodeView, 'modifier', ['Ctrl', 'Shift']);
    }

    key: KeyControl;
    modifier: KeyControl;
}

export class KeyControl extends PropController {
    private nodeObj: NodeObj<KeyboardNodeParams>;
    private paramName: string;
    private keys: string[] = [];

    constructor(registry: Registry, nodeView: NodeView, paramName: string, keys: string[]) {
        super(registry);
        this.nodeObj = nodeView.getObj();
        this.paramName = paramName;
        this.keys = keys;
    }

    values() {
        return this.keys;
    }

    val() {
        return this.nodeObj.param[this.paramName].val;
    }

    change(val) {
        this.nodeObj.param[this.paramName].val = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}