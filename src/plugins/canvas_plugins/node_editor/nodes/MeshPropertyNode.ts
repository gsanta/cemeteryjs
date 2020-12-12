import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParam, NodeParamField, NodeParams, NodeParamRole, PortDataFlow, PortDirection } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshViewType } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(nodeView.getObj()), new MeshVisibilityController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new MeshPropertyNodeParams(), {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.executor = new MeshPropertyNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class MeshPropertyNodeParams extends NodeParams {    
    readonly signal: NodeParam = {
        name: 'signal',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }

    readonly mesh = {
        name: 'mesh',
        field: NodeParamField.List,
        val: '',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Pull
        }
    }

    readonly visible = {
        name: 'visible',
        field: NodeParamField.Checkbox,
        val: 1,
    }
}

export class MeshController extends PropController<string> {
    private nodeObj: NodeObj<MeshPropertyNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal() {
        return this.nodeObj.param.mesh.val;
    }

    change(val, context: PropContext) {
        this.nodeObj.param.mesh.val = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshVisibilityController extends PropController<string> {
    private nodeObj: NodeObj<MeshPropertyNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['visible']; }

    defaultVal() {
        return this.nodeObj.param.visible.val;
    }

    change(val, context: PropContext) {
        this.nodeObj.param.visible.val = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
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

        let meshObj: MeshObj;
        if (this.nodeObj.getPort('mesh').hasConnectedPort()) {
            meshObj = this.getMeshObjFromPort();
        } else {
            meshObj = this.getMeshObjFromField();
        }

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    private getMeshObjFromPort(): MeshObj {
        return this.nodeObj.pullData('mesh');
    }

    private getMeshObjFromField(): MeshObj {
        const meshId = this.nodeObj.param.mesh.val;
        if (meshId) {
            return <MeshObj> this.registry.data.view.scene.getById(meshId).getObj();
        }
    }

    executeStop() {}
}