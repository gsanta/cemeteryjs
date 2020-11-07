import { NodeLink, NodeParam } from "../../../../core/models/objs/NodeObj";
import { MeshViewType } from "../../../../core/models/views/MeshView";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
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

    getController(): FormController {
        return new FormController(undefined, this.registry, [new MeshController()]);
    }

    getExecutor(): INodeExecutor {
        return undefined;
    }
}

export class MeshController extends PropController<string> {
    acceptedProps() { return ['mesh']; }

    values(context) {
        return context.registry.stores.views.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal(context: PropContext, element: UI_InputElement) {
        return (context.registry.data.view.node.getById(element.targetId) as NodeView).getObj().getParam('mesh').val;
    }

    change(val, context: PropContext, element: UI_InputElement) {
        const nodeView = context.registry.data.view.node.getById(element.targetId) as NodeView;
        nodeView.getObj().setParam('mesh', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}