import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
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

        this.keyDown = new KeyDownNodeParam(nodeObj, this);
        this.keyUp = new KeyUpNodeParam(nodeObj, this);
        this.key = new KeyboardNodeParam('key', nodeObj);
        this.modifier = new KeyboardModifierNodeParam(nodeObj);

    }

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
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Push
    }

    listener: INodeListener = {
        onKeyDown: (e: IKeyboardEvent) => {
            if (this.isModifierMatch(e) && this.params.key.val === getKeyFromKeyCode(e.keyCode)) {
                this.push();
            }
        }
    }

    private isModifierMatch(e: IKeyboardEvent) {
        return (
            this.params.modifier.getVal() === undefined ||
            this.params.modifier.getVal() === "" ||
            e.isCtrlDown && this.params.modifier.getVal() === 'Ctrl' ||
            e.isShiftDown && this.params.modifier.getVal() === 'Shift'
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
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Push
    }

    listener: INodeListener = {
        onKeyUp: (e: IKeyboardEvent) => {
            if (this.params.key.val === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
                this.push();
            }
        }
    }
}

export class KeyboardNodeParam extends NodeParam {
    name: string;
    val = '';
    field = NodeParamField.List;

    constructor(name: string, nodeObj: NodeObj) {
        super(nodeObj);
        this.name = name;
    }
}

export class KeyboardModifierNodeParam extends NodeParam {
    name: string = 'modifier'
    val = '';
    field = NodeParamField.List;

    constructor(nodeObj: NodeObj) {
        super(nodeObj);
    }
}