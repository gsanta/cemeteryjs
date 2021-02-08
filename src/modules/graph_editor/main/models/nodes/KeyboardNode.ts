import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection, PortValueType } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { getKeyFromKeyCode, IKeyboardEvent } from "../../../../../core/controller/KeyboardHandler";
import { AbstractNodeListener, INodeListener } from "../../api/INodeListener";
import { NodeShape } from "../shapes/NodeShape";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { KeyboardNodeControllers } from "../../controllers/nodes/KeyboardNodeController";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeEditorPanelId } from "../../../NodeEditorModule";
import { SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorModule";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";

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

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new KeyboardNodeControllers(this.registry, nodeView));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const canvas =  <Canvas3dPanel> this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const obj = new NodeObj<KeyboardNodeParams>(this.nodeType, canvas, {displayName: this.displayName});
        const params = new KeyboardNodeParams(obj);
        obj.setParams(params);
        obj.listener = new KeyboardNodeListener(obj, obj.param);
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class KeyboardNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.isKeyDown = new IsKeyDownNodeParam(nodeObj);
        this.keyDown = new KeyDownNodeParam(nodeObj);
        this.keyUp = new KeyUpNodeParam(nodeObj);
        this.key = new KeyboardNodeParam(nodeObj);
        this.modifier = new KeyboardModifierNodeParam(nodeObj);

    }

    readonly isKeyDown: IsKeyDownNodeParam;
    readonly keyDown: KeyDownNodeParam;
    readonly keyUp: KeyUpNodeParam;
    readonly key: NodeParam;
    readonly modifier: NodeParam;
}

export class KeyDownNodeParam extends NodeParam {
    name = 'keyDown';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

export class KeyUpNodeParam extends NodeParam {
    name = 'keyUp';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

export class IsKeyDownNodeParam extends NodeParam {
    name = 'isKeyDown';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
    portValueType = PortValueType.Boolean;
}

export class KeyboardNodeParam extends NodeParam {
    name: string = 'key';
    ownVal = '';
}

export class KeyboardModifierNodeParam extends NodeParam {
    name: string = 'modifier'
    ownVal = '';

    constructor(nodeObj: NodeObj) {
        super(nodeObj);
    }
}

export class KeyboardNodeListener extends AbstractNodeListener {
    private params: KeyboardNodeParams;
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj, params: KeyboardNodeParams) {
        super();
        this.params = params;
        this.nodeObj = nodeObj;
    }


    onKeyDown(e: IKeyboardEvent) {
        if (this.isModifierMatch(e, this.params.modifier.ownVal) && this.params.key.ownVal === getKeyFromKeyCode(e.keyCode)) {
            this.params.isKeyDown.ownVal = true;
            this.nodeObj.getPortForParam(this.params.isKeyDown).push();
            this.nodeObj.getPortForParam(this.params.keyDown).push();
        }
    }

    onKeyUp(e: IKeyboardEvent) {
        if (this.params.key.ownVal === String.fromCharCode(e.keyCode).toLocaleLowerCase()) {
            this.params.isKeyDown.ownVal = false;
            this.nodeObj.getPortForParam(this.params.isKeyDown).push();
            this.nodeObj.getPortForParam(this.params.keyUp).push();
        }
    }

    private isModifierMatch(e: IKeyboardEvent, val: string) {
        return (
            val === undefined ||
            val === "" ||
            e.isCtrlDown && val === 'Ctrl' ||
            e.isShiftDown && val === 'Shift'
        );
    }
}