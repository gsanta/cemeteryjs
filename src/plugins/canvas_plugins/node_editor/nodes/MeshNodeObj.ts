import { NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Plugin";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const MeshNodeType = 'mesh-node-obj';

export const MeshNodeFacotry: NodeFactory = {
    createNodeObj(): NodeObj {
        const obj = new NodeObj(MeshNodeType, {displayName: 'Mesh'});

        obj.addParam({
            name: 'mesh',
            val: '',
            uiOptions: {
                inputType: 'list',
                valueType: 'string'
            }
        });

        obj.outputs = [
            {
                name: 'action'
            }
        ];
    
        return obj;
    },

    createPropControllers(): PropController[] {
        return [new MeshController()];
    },

    createExecutor(): INodeExecutor {
        return undefined;
    }
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