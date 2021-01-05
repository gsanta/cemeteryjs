import { NodeObj, NodeObjType, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { IKeyboardEvent } from "../../../../../core/services/input/KeyboardService";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { GameViewerPanelId } from "../../../game_viewer/registerGameViewer";
import { GameTool, GameToolId } from "../../../game_viewer/tools/GameTool";
import { INodeListener } from "../../node/INodeListener";
import { AbstractNodeFactory } from "../AbstractNode";
import { KeyboardNodeControllers, KeyControl, KEY_REGEX } from "./KeyboardNodeController";

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
        // obj.executor = new KeyboardNodeExecutor(this.registry, params, obj);
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
            if (this.params.key.val === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
                this.callConnectedPorts();
            }
        }
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
                this.callConnectedPorts();
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

// export class KeyboardNodeExecutor extends AbstractNodeExecutor<KeyboardNodeParams> {
//     private registry: Registry;
//     private keyboardNodeParams: KeyboardNodeParams;

//     constructor(registry: Registry, keyboardNodeParams: KeyboardNodeParams, nodeObj: NodeObj) {
//         super(nodeObj);
//         this.registry = registry;
//         this.keyboardNodeParams = keyboardNodeParams;
//     }

//     execute() {
//         const keyParams = this.getKeyParams(this.nodeObj);
//         const gameTool = <GameTool> this.registry.ui.canvas.getCanvas(GameViewerPanelId).toolController.getToolById(GameToolId);
//         const param = keyParams.find(param => param.val === gameTool.lastExecutedKey);

//         if (param) {
//             this.keyboardNodeParams[param.name].callConnectedPorts();
//         }
//     }

//     executeStop() {}

//     private getKeyParams(nodeObj: NodeObj): NodeParam[] {
//         return nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
//     }
// }