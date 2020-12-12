import { NodeObj, NodeParam, NodeParamField, NodeParams, NodeParamRole, PortDirection, PortDataFlow } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { MeshViewType } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";

export const MeshNodeType = 'mesh-node-obj';

export class MeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MeshNodeType;
    displayName = 'Mesh';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<MeshNodeParams>(this.nodeType, new MeshNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class MeshNodeParams extends NodeParams {
    readonly mesh: NodeParam = {
        name: 'mesh',
        field: NodeParamField.List,
        val: '',
    }
    
    readonly action: NodeParam = {
        name: 'action',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }

}

export class MeshController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal() {
        return this.nodeView.getObj().param.mesh.val;
    }

    change(val, context: PropContext) {
        this.nodeView.getObj().setParam('mesh', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}