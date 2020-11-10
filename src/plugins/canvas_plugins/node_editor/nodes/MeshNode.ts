import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { NodeRenderer } from "../NodeRenderer";
import { AbstractNode } from "./AbstractNode";

export const MeshNodeType = 'mesh-node-obj';

export class MeshNode extends AbstractNode {
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
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputLinks();
        obj.outputs = this.getOutputLinks();
        obj.id = this.registry.stores.objStore.generateId(obj);

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

    getOutputLinks(): NodeLink[] {
        return [
            {
                name: 'action'
            }
        ];
    }

    getInputLinks(): NodeLink[] {
        return [];
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