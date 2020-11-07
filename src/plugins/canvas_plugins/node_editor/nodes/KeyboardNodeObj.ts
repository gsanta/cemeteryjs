import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { getAllKeys } from "../../../../core/services/input/KeyboardService";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { GameViewerPanelId } from "../../game_viewer/registerGameViewer";
import { GameTool, GameToolId } from "../../game_viewer/tools/GameTool";
import { AbstractNode } from "./AbstractNode";

export const KeyboardNodeType = 'keyboard-node-obj';

export class KeyboardNode extends AbstractNode {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = KeyboardNodeType;
    displayName = 'Keyboard';
    category = 'Default';

    getParams(): NodeParam[] {
        return [
            {
                name: 'key1',
                val: '',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string',
                },
                isLink: 'output'
            }
        ];
    }

    getOutputLinks(): NodeLink[] {
        return [];
    }

    getInputLinks(): NodeLink[] {
        return [];
    }

    
    getController(): FormController {
        return new FormController(undefined, this.registry, [new KeyControl()]);
    }

    getExecutor(): INodeExecutor {
        return new KeyboardNodeExecutor(this.registry);
    }
}

const KEY_REGEX = /key(\d*)/;

export class KeyboardNodeExecutor implements INodeExecutor {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    execute(nodeObj: NodeObj) {
        const keyParams = this.getKeyParams(nodeObj);

        const gameTool = <GameTool> this.registry.ui.canvas.getCanvas(GameViewerPanelId).toolController.getToolById(GameToolId);
        
        const param = keyParams.find(param => param.val === gameTool.lastExecutedKey);

        if (param) {
            const connection = nodeObj.connections.get(param.name);
            if (connection) {
                nodeObj.executor.execute(nodeObj);
            }
        }
    }

    executeStop() {}

    private getKeyParams(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.name.match(KEY_REGEX));
    }
}

export class KeyControl extends PropController {
    acceptedProps(context: PropContext, element: UI_Element) {
        const nodeView = context.registry.stores.views[element.targetId];
        return (<NodeObj> nodeView.getObj()).getParams().filter(param => param.name.match(KEY_REGEX)).map(param => param.name);
    }

    values() {
        return getAllKeys();
    }

    defaultVal(context: PropContext, element: UI_InputElement) {
        return (context.registry.stores.views.getById(element.targetId) as NodeView).getObj().getParam(element.key).val;
    }

    change(val, context: PropContext, element: UI_InputElement) {
        context.updateTempVal(val);
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        nodeView.getObj().setParam(element.key, val);
        context.registry.services.history.createSnapshot();

        const keys = nodeView.getObj().getParams().filter(param => param.name.match(KEY_REGEX));
        let newIndex = 2;

        const keyIndexes = keys.map(key => parseInt(key.name.match(KEY_REGEX)[1], 10));
        keyIndexes.sort((a, b) => b - a);

        if (keyIndexes.length > 0) {
            newIndex = keyIndexes[0] + 1;
        }
        
        nodeView.getObj().addParam({
            name: `key${newIndex}`,
            val: '',
            uiOptions: {
                inputType: 'list',
                valueType: 'string',
            },
            isLink: 'output'
        });
        context.clearTempVal();
        nodeView.setup();

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}