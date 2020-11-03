import { NodeObj } from "../../../../core/models/objs/NodeObj";
import { MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropController, PropContext, FormController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { NodeFactory } from "../../../../core/services/NodePlugin";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { NodeEditorPluginId } from "../NodeEditorPlugin";

export const MeshNodeType = 'mesh-node-obj';

export class MeshNodeFacotry implements NodeFactory {
    id = MeshNodeType;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

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
    }

    getController(): FormController {
        return new FormController(this.registry.plugins.getPlugin(NodeEditorPluginId), this.registry, [new MeshController()]);
    }

    createExecutor(): INodeExecutor {
        return undefined;
    }
}

export class MeshController extends PropController<string> {
    acceptedProps() { return ['mesh']; }

    values(context) {
        return context.registry.stores.views.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal(context: PropContext, element: UI_InputElement) {
        return (context.registry.stores.views.getById(element.targetId) as NodeView).getObj().getParam('mesh').val;
    }

    change(val, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        nodeView.getObj().setParam('mesh', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}