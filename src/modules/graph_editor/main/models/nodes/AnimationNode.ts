import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeShape } from "../shapes/NodeShape";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { AnimationNodeControllers } from "../../controllers/nodes/AnimationNodeControllers";
import { NodeEditorPanelId } from "../../../NodeEditorModule";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";

export const AnimationNodeType = 'animation-node-obj';

export class AnimationNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = AnimationNodeType;
    displayName = 'Animation';
    category = 'Default';

    
    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new AnimationNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new AnimationNodeParams());
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class AnimationNodeParams extends NodeParams {
    readonly mesh: NodeParam = {
        name: 'mesh',
        ownVal: '',
    }

    readonly startFrame: NodeParam = {
        name: 'startFrame',
        ownVal: 0,
    }
    
    readonly endFrame: NodeParam = {
        name: 'endFrame',
        ownVal: 0,
    }
    
    readonly action: NodeParam = {
        name: 'action',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
}