import { NodeObj, NodeParam, NodeParamField, NodeParams, NodeParamRole, PortDataFlow, PortDirection } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PathViewType } from "../../scene_editor/views/PathView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeFactory } from "./AbstractNode";

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
        nodeView.addParamController(new PathController(nodeView.getObj()));

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

export class PathController extends PropController<string> {
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['path']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(PathViewType).map(pathView => pathView.id);
    }

    defaultVal() {
        return this.nodeObj.param.path.val;
    }

    change(val, context: PropContext) {
        this.nodeObj.param.path = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}