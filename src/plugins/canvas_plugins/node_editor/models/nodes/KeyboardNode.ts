import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection, PortValueType } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { getKeyFromKeyCode, IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
import { INodeListener } from "../../api/INodeListener";
import { NodeView } from "../views/NodeView";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { KeyboardNodeControllers } from "../../controllers/nodes/KeyboardNodeController";

export const KeyboardNodeType = 'keyboard-node-obj';

export class KeyboardNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = KeyboardNodeType;
    displayName = 'Keyboard';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new KeyboardNodeControllers(this.registry, nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<KeyboardNodeParams>(this.nodeType, {displayName: this.displayName});
        const params = new KeyboardNodeParams(obj);
        obj.setParams(params);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class KeyboardNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.isKeyDown = new IsKeyDownNodeParam(nodeObj, this);
        this.keyDown = new KeyDownNodeParam(nodeObj, this);
        this.keyUp = new KeyUpNodeParam(nodeObj, this);
        this.key = new KeyboardNodeParam('key', nodeObj);
        this.modifier = new KeyboardModifierNodeParam(nodeObj);

    }

    readonly isKeyDown: IsKeyDownNodeParam;
    readonly keyDown: KeyDownNodeParam;
    readonly keyUp: KeyUpNodeParam;
    readonly key: NodeParam;
    readonly modifier: NodeParam;
}

export class KeyDownNodeParam extends NodeParam {
    private params: KeyboardNodeParams;

    constructor(nodeObj: NodeObj, params: KeyboardNodeParams) {
        super(nodeObj);
        this.params = params;
    }

    name = 'keyDown';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;

    listener: INodeListener = {
        onKeyDown: (e: IKeyboardEvent) => {
            if (this.isModifierMatch(e) && this.params.key.ownVal === getKeyFromKeyCode(e.keyCode)) {
                this.nodeObj.getPortForParam(this).push();
            }
        }
    }

    private isModifierMatch(e: IKeyboardEvent) {
        return (
            this.params.modifier.ownVal === undefined ||
            this.params.modifier.ownVal === "" ||
            e.isCtrlDown && this.params.modifier.ownVal === 'Ctrl' ||
            e.isShiftDown && this.params.modifier.ownVal === 'Shift'
        );
    }
}

export class KeyUpNodeParam extends NodeParam {
    private params: KeyboardNodeParams;

    constructor(nodeObj: NodeObj, params: KeyboardNodeParams) {
        super(nodeObj);
        this.params = params;
    }

    name = 'keyUp';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;

    listener: INodeListener = {
        onKeyUp: (e: IKeyboardEvent) => {
            if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
                this.nodeObj.getPortForParam(this).push();
            }
        }
    }
}

export class IsKeyDownNodeParam extends NodeParam {
    private params: KeyboardNodeParams;

    constructor(nodeObj: NodeObj, params: KeyboardNodeParams) {
        super(nodeObj);
        this.params = params;
    }

    name = 'isKeyDown';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
    portValueType = PortValueType.Boolean;

    listener: INodeListener = {
        onKeyDown: (e: IKeyboardEvent) => {
            if (this.isModifierMatch(e) && this.params.key.ownVal === getKeyFromKeyCode(e.keyCode)) {
                this.ownVal = true;
                this.nodeObj.getPortForParam(this).push();
            }
        },
        onKeyUp: (e: IKeyboardEvent) => {
            if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
                this.ownVal = false;
                this.nodeObj.getPortForParam(this).push();
            }
        }
    }

    private isModifierMatch(e: IKeyboardEvent) {
        return (
            this.params.modifier.ownVal === undefined ||
            this.params.modifier.ownVal === "" ||
            e.isCtrlDown && this.params.modifier.ownVal === 'Ctrl' ||
            e.isShiftDown && this.params.modifier.ownVal === 'Shift'
        );
    }
}

export class KeyboardNodeParam extends NodeParam {
    name: string;
    ownVal = '';

    constructor(name: string, nodeObj: NodeObj) {
        super(nodeObj);
        this.name = name;
    }
}

export class KeyboardModifierNodeParam extends NodeParam {
    name: string = 'modifier'
    ownVal = '';

    constructor(nodeObj: NodeObj) {
        super(nodeObj);
    }
}