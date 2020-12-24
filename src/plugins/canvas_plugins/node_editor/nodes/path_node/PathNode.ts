import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { PathViewType } from "../../../scene_editor/views/PathView";
import { PropContext, PropController } from '../../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../AbstractNode";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../../core/models/objs/node_obj/NodeParam";
import { PathNodeControllers } from "./PathNodeControllers";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.id = this.registry.data.view.node.generateId(nodeView);
        nodeView.addParamControllers(new PathNodeControllers(this.registry, obj));

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new PathNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class PathNodeParams extends NodeParams {
    readonly path: NodeParam = {
        name: 'path',
        field: NodeParamField.List,
        val: '',
    }
    
    readonly action: NodeParam = {
        name: 'action',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
}