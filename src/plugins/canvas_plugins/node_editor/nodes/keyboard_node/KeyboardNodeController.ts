import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { getAllKeys } from "../../../../../core/services/input/KeyboardService";
import { KeyboardNodeParam, KeyboardNodeParams } from "./KeyboardNode";

export const KEY_REGEX = /key(\d*)/;

export class KeyboardNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeView: NodeView) {
        super();

        nodeView.getObj().getParams().forEach(param => {
            if (param.name.match(KEY_REGEX)) {
                this[param.name] = new KeyControl(registry, this, nodeView, param.name);
            }
        });
    }
}

export class KeyControl extends PropController {
    private nodeObj: NodeObj<KeyboardNodeParams>;
    private nodeView: NodeView;
    private paramName: string;
    private controllers: KeyboardNodeControllers;

    constructor(registry: Registry, controllers: KeyboardNodeControllers, nodeView: NodeView, paramName: string) {
        super(registry);
        this.nodeObj = nodeView.getObj();
        this.nodeView = nodeView;
        this.paramName = paramName;
        this.controllers = controllers;
    }

    acceptedProps() {
        return this.nodeObj.getParams().filter(param => param.name.match(KEY_REGEX)).map(param => param.name);
    }

    values() {
        return getAllKeys();
    }

    val() {
        return this.nodeObj.param[this.paramName].val;
    }

    change(val) {
        this.nodeObj.param[this.paramName].val = val;
        this.registry.services.history.createSnapshot();

        this.createNewKeyParam();

        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    private createNewKeyParam() {
        const keys = this.nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
        let newIndex = 2;

        const keyIndexes = keys.map(key => parseInt(key.name.match(KEY_REGEX)[1], 10));
        keyIndexes.sort((a, b) => b - a);

        if (keyIndexes.length > 0) {
            newIndex = keyIndexes[0] + 1;
        }

        const keyName = `key${newIndex}`;
        
        this.nodeObj.param[keyName] = new KeyboardNodeParam(keyName);
        this.controllers[keyName] = new KeyControl(this.registry, this.controllers, this.nodeView, keyName);
        this.nodeObj.initParams();
        this.nodeView.setup();
    }
}