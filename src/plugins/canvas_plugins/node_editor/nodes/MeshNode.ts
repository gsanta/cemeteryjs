import { NodeObj, NodeParam, NodeParamFieldType, NodeParams, NodeParamType } from "../../../../core/models/objs/NodeObj";
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
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<MeshNodeParams>(this.nodeType, {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.param = new MeshNodeParams();
        
        return obj;
    }
}

export class MeshNodeParams implements NodeParams {
    mesh = {
        name: 'mesh',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.List,
        val: '',
    }
    
    action = {
        name: 'action',
        type: NodeParamType.Port,
        port: 'input'
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