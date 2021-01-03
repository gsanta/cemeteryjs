import { NodeObj, NodeObjType, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { GameViewerPanelId } from "../../../game_viewer/registerGameViewer";
import { GameTool, GameToolId } from "../../../game_viewer/tools/GameTool";
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
        obj.setParams(new KeyboardNodeParams(obj));
        obj.executor = new KeyboardNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class KeyboardNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.key1 = new KeyboardNodeParam('key1', nodeObj);
    }

    readonly key1: NodeParam;
}

export class KeyboardNodeParam extends NodeParam {
    name: string;
    val = '';
    field = NodeParamField.List;
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Push
    };

    constructor(name: string, nodeObj: NodeObj) {
        super(nodeObj);
        this.name = name;
    }
}

export class KeyboardNodeExecutor extends AbstractNodeExecutor<KeyboardNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const keyParams = this.getKeyParams(this.nodeObj);
        const gameTool = <GameTool> this.registry.ui.canvas.getCanvas(GameViewerPanelId).toolController.getToolById(GameToolId);
        const param = keyParams.find(param => param.val === gameTool.lastExecutedKey);

        if (param) {
            this.registry.services.node.executePort(this.nodeObj, param.name);
        }
    }

    executeStop() {}

    private getKeyParams(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
    }
}