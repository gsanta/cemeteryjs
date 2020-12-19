import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../core/models/views/NodeView";
import { MultiSelectController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
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
        nodeView.addParamController(new MeshController(this.registry, nodeView.getObj()));
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
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Pull
        }
    }
}

export class MeshController extends PropController<string> {
    private nodeObj: NodeObj<MeshNodeParams>;
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj<MeshNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
        this.registry = registry;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.stores.objStore.getObjsByType(MeshObjType).map(meshView => meshView.id)
    }

    defaultVal() {
        return this.nodeObj.param.mesh.val ? this.nodeObj.param.mesh.val.id : undefined;
    }

    change(val: string, context: PropContext) {
        this.nodeObj.param.mesh.val = <MeshObj> this.registry.stores.objStore.getById(val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MultiMeshController extends MultiSelectController {
    private nodeObj: NodeObj;
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
        this.registry = registry;
    }

    acceptedProps() { return ['mesh']; }

    values(context: PropContext) {
        return context.registry.stores.objStore.getObjsByType(MeshObjType).map(meshObj => meshObj.id)
    }

    selectedValues() {
        return this.nodeObj.param.mesh.val.map(meshObj => meshObj.id);
    }

    defaultVal() {
        return  undefined;
    }

    click(context: PropContext) {
        this.isPopupOpen = !this.isPopupOpen;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    change(val: string, context: PropContext) {
        this.nodeObj.param.mesh.val.push(this.registry.stores.objStore.getById(val));
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}