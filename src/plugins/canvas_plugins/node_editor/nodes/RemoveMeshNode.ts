import { NodePort, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { RayObj } from "../../../../core/models/objs/RayObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshViewType } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";

export const RemoveMeshNodeType = 'remove-mesh-node-obj';

export class RemoveMeshNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Remove Mesh';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputLinks();
        obj.outputs = this.getOutputLinks();
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.executor = new RemoveMeshNodeExecutor(this.registry, obj);

        return obj;
    }


    getParams(): NodeParam[] {
        return [
            {
                name: 'mesh',
                val: '',
                uiOptions: {
                    inputType: 'list',
                    valueType: 'string'
                }
            }
        ];
    }

    getOutputLinks(): NodePort[] {
        return [
            {
                name: 'action'
            }
        ];
    }

    getInputLinks(): NodePort[] {
        return [
            {
                name: 'signal'
            }
        ];
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
        return this.nodeView.getObj().getParam('mesh').val;
    }

    change(val, context: PropContext) {
        this.nodeView.getObj().setParam('mesh', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class RemoveMeshNodeExecutor implements INodeExecutor {
    private registry: Registry;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        this.registry = registry;
        this.nodeObj = nodeObj;
    }

    execute() {
        const meshId = this.nodeObj.getParam('mesh').val;
        const meshView = this.registry.data.view.scene.getById(meshId);

        if (meshView) {
            this.registry.stores.objStore.removeObj(meshView.getObj());
        }
    }

    executeStop() {}
}