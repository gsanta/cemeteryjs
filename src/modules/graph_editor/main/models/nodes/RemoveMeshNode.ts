import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeShape } from "../shapes/NodeShape";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { RemoveMeshNodeControllers } from "../../controllers/nodes/RemoveMeshNodeControllers";
import { MeshNodeParam } from "./MoveNode";
import { INodeListener } from "../../api/INodeListener";
import { threadId } from "worker_threads";
import { RemoveMeshNodeListener } from "./listeners/RemoveMeshNodeListener";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeEditorPanelId } from "../../../NodeEditorCanvas";

export const RemoveMeshNodeType = 'remove-mesh-node-obj';

export class RemoveMeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Remove Mesh';
    category = 'Mesh';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, this.registry.services.module.ui.nodeEditor);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RemoveMeshNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, this.registry.services.module.ui.sceneEditor, {displayName: this.displayName});
        obj.setParams(new RemoveMeshNodeParams(obj));
        obj.listener = new RemoveMeshNodeListener(this.registry, obj, obj.param);
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RemoveMeshNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super()

        this.mesh = new MeshNodeParam(nodeObj);
    }

    readonly action: NodeParam = {
        name: 'action',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
    
    readonly signal: NodeParam = {
        name: 'signal',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push
    }

    readonly mesh: MeshNodeParam;
}