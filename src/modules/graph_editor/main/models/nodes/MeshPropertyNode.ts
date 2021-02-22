import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { NodeShape } from "../shapes/NodeShape";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { MeshPropertyNodeControllers } from "../../controllers/nodes/MeshPropertyNodeControllers";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeEditorPanelId } from "../../../NodeEditorCanvas";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorCanvas";

export const MeshPropertyNodeType = 'mesh-property-node-obj';

export class MeshPropertyNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MeshPropertyNodeType;
    displayName = 'Mesh Property';
    category = 'Mesh';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new MeshPropertyNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const canvas =  <Canvas3dPanel> this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const obj = new NodeObj(this.nodeType, canvas, {displayName: this.displayName});
        obj.setParams(new MeshPropertyNodeParams());
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;
        obj.executor = new MeshPropertyNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class MeshPropertyNodeParams extends NodeParams {    
    readonly signal: NodeParam = {
        name: 'signal',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        ownVal: undefined,
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Pull
    }

    readonly visible = {
        name: 'visible',
        val: 1,
    }
}

export class MeshPropertyNodeExecutor extends AbstractNodeExecutor<MeshPropertyNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const visibility: number = this.nodeObj.param.visible.val;

        let meshObj: MeshObj = this.nodeObj.getPort('mesh').getNodeParam().getPortOrOwnVal();

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    executeStop() {}
}