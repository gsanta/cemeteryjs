import { NodeCategory, NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const MeshNodeFacotry: NodeFactory = {
    createNodeObj(graph: NodeGraph): NodeObj {
        return new MeshNodeObj(graph);
    },

    createPropControllers(): PropController[] {
        return [new MeshController()];
    },

    createExecutor(): INodeExecutor {
        return undefined;
    }
}

export const MeshNodeType = 'mesh-node-obj';
export class MeshNodeObj extends NodeObj {
    type = MeshNodeType;
    category = NodeCategory.Default;
    displayName = 'Mesh';

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'mesh',
            val: '',
            uiOptions: {
                inputType: 'list',
                valueType: 'string'
            }
        });
    }

    outputs = [
        {
            name: 'action'
        }
    ];
}

export class MeshController extends PropController<string> {
    acceptedProps() { return ['mesh']; }

    values(context) {
        return context.registry.stores.views.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.views.getById(element.targetId) as NodeView).getObj().getParam('mesh').val;
    }

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        nodeView.getObj().setParam('mesh', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}