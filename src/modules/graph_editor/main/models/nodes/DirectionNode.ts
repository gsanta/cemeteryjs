import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection, PortValueType } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorCanvas";
import { NodeEditorPanelId } from "../../../NodeEditorCanvas";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { DirectionNodeControllers } from "../../controllers/nodes/DirectionNodeControllers";
import { NodeShape } from "../shapes/NodeShape";
import { DirectionNodeListener } from "./listeners/DirectionNodeListener";
import { MoveDirection } from "./MoveNode";

export const DirectionNodeType = 'direction-node-obj';

export class DirectionNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = DirectionNodeType;
    displayName = 'Direction';
    category = 'Default';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new DirectionNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const canvas =  <Canvas3dPanel> this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const obj = new NodeObj(this.nodeType, canvas, {displayName: this.displayName});
        obj.setParams(new DirectionNodeParams(obj));
        obj.listener = new DirectionNodeListener(obj.param);
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class DirectionNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.on = new OnNodeParam(nodeObj);
        this.dirOrUndef = new DirectionOrUndef(nodeObj);
        this.direction = new DirectionNodeParam(nodeObj);
    }

    readonly on: OnNodeParam;
    readonly dirOrUndef: DirectionOrUndef;
    readonly direction: DirectionNodeParam;

    readonly state: NodeParam<boolean> = {
        name: 'state',
        doNotSerialize: true,
        ownVal: false
    }
}

class DirectionOrUndef extends NodeParam<MoveDirection> {
    name = 'dirOrUndef';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

class OnNodeParam extends NodeParam {
    name = 'on';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
    portValueType = PortValueType.Boolean;
}

class DirectionNodeParam extends NodeParam {
    name = 'direction'
    ownVal = undefined;
}