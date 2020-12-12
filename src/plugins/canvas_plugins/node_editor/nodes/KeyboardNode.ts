import { NodeObj, NodeParam, NodeParamField, NodeParams, NodeParamRole, PortDirection, PortDataFlow, NodeObjType } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { getAllKeys } from "../../../../core/services/input/KeyboardService";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { GameViewerPanelId } from "../../game_viewer/registerGameViewer";
import { GameTool, GameToolId } from "../../game_viewer/tools/GameTool";
import { AbstractNodeFactory } from "./AbstractNode";

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
        nodeView.addParamController(new KeyControl(nodeView.getObj(), nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<KeyboardNodeParams>(this.nodeType, new KeyboardNodeParams(), {displayName: this.displayName});
        
        obj.executor = new KeyboardNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class KeyboardNodeParams extends NodeParams {
    readonly key1: NodeParam = {
        name: 'key1',
        val: '',
        field: NodeParamField.List,
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
}

const KEY_REGEX = /key(\d*)/;

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
        
        this.registry.stores.objStore.getAll().forEach((obj) => {
            if (obj.objType === NodeObjType) {
                console.log((obj as NodeObj).getPorts().map(port => `${port.getNodeParam().name} ${port.hasConnectedPort()}`).join(', '))
            }
        })


        if (param) {
            this.registry.services.node.executePort(this.nodeObj, param.name);
        }
    }

    executeStop() {}

    private getKeyParams(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
    }
}

export class KeyControl extends PropController {
    private nodeObj: NodeObj<KeyboardNodeParams>;
    private nodeView: NodeView;

    constructor(nodeObj: NodeObj<KeyboardNodeParams>, nodeView: NodeView) {
        super();
        this.nodeObj = nodeObj;
        this.nodeView = nodeView;
    }

    acceptedProps(context: PropContext, element: UI_Element) {
        return this.nodeObj.getParams().filter(param => param.name.match(KEY_REGEX)).map(param => param.name);
    }

    values() {
        return getAllKeys();
    }

    defaultVal(context: PropContext, element: UI_InputElement) {
        return this.nodeObj.param[element.key].val;
    }

    change(val, context: PropContext, element: UI_InputElement) {
        context.updateTempVal(val);
        this.nodeObj.param[element.key].val = val;
        context.registry.services.history.createSnapshot();

        const keys = this.nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
        let newIndex = 2;

        const keyIndexes = keys.map(key => parseInt(key.name.match(KEY_REGEX)[1], 10));
        keyIndexes.sort((a, b) => b - a);

    if (keyIndexes.length > 0) {
            newIndex = keyIndexes[0] + 1;
        }
        
        this.nodeObj.param[`key${newIndex}`] = {
            name: `key${newIndex}`,
            val: '',
            field: NodeParamField.List,
            port: {
                direction: PortDirection.Output,
                dataFlow: PortDataFlow.Push
            }
        };
        this.nodeObj.initParams();
        context.clearTempVal();
        this.nodeView.setup();

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}