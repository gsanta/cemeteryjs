import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorCanvas";
import { NodeEditorPanelId } from "../../../NodeEditorCanvas";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { AnimationGroupNodeControllers } from "../../controllers/nodes/AnimationGroupNodeControllers";
import { NodeShape } from "../shapes/NodeShape";
import { AnimationGroupNodeListener } from "./listeners/AnimationGroupNodeListener";
import { MeshNodeParam } from "./MoveNode";

export const RemoveMeshNodeType = 'animation-group-node-obj';

export class AnimationGroupNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Animation Group';
    category = 'Mesh';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new AnimationGroupNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const canvas =  <Canvas3dPanel> this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const obj = new NodeObj(this.nodeType, canvas, {displayName: this.displayName});
        obj.setParams(new AnimationGroupNodeParams(obj));
        obj.listener = new AnimationGroupNodeListener(this.registry, obj.param);
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class AnimationGroupNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.signalStart = new SignalStartNode(nodeObj);
        this.signalStop = new SignalStopNode(nodeObj);
        this.mesh = new MeshNodeParam(nodeObj)
    }

    readonly signalStart: NodeParam;
    readonly signalStop: NodeParam;

    readonly mesh: MeshNodeParam; 

    readonly animation: NodeParam<string> = {
        name: 'animation',
        ownVal: undefined
    }
}

class SignalStartNode extends NodeParam {
    name = 'signalStart';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}

class SignalStopNode extends NodeParam {
    name = 'signalStop';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}