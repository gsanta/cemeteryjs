import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeEditorPanelId } from "../../../NodeEditorModule";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { PathNodeControllers } from "../../controllers/nodes/PathNodeControllers";
import { NodeShape } from "../shapes/NodeShape";

export const PathNodeType = 'path-node-obj';

export class PathNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = PathNodeType;
    displayName = 'Path';
    category = 'Default';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new PathNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new PathNodeParams());
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class PathNodeParams extends NodeParams {
    readonly path: NodeParam = {
        name: 'path',
        ownVal: '',
    }
    
    readonly action: NodeParam = {
        name: 'action',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
}