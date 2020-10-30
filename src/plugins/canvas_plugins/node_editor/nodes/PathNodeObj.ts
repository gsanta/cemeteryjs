import { NodeObj } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PathViewType } from "../../../../core/models/views/PathView";
import { PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";

export const PathNodeType = 'path-node-obj';

export const PathNodeFacotry: NodeFactory = {
    createNodeObj(): NodeObj {
        const obj = new NodeObj(PathNodeType, {displayName: 'Path'});

        obj.addParam({
            name: 'path',
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
        return [new PathController()];
    },

    createExecutor(): INodeExecutor {
        return undefined;
    }
}

export class PathController extends PropController<string> {
    acceptedProps() { return ['path']; }

    values(context) {
        return context.registry.stores.views.getViewsByType(PathViewType).map(pathView => pathView.id);
    }

    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        return nodeView.getObj().getParam('path').val;
    }

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        nodeView.getObj().setParam('path', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}