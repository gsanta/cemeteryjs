import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PathViewType } from "../../../../core/models/views/PathView";
import { PropController, PropContext, FormController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { AbstractNode } from "./AbstractNode";

export const PathNodeType = 'path-node-obj';

export class PathNode extends AbstractNode {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = PathNodeType;
    displayName = 'Path';
    category = 'Default';

    getParams(): NodeParam[] {
        return [
            {
                name: 'path',
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
        ]
    }

    getInputLinks(): NodeLink[] {
        return [];
    }

    getController(): FormController {
        return new FormController(undefined, this.registry, [new PathController()]);
    }

    getExecutor(): INodeExecutor {
        return undefined;
    }
}

export class PathController extends PropController<string> {
    acceptedProps() { return ['path']; }

    values(context) {
        return context.registry.stores.views.getViewsByType(PathViewType).map(pathView => pathView.id);
    }

    defaultVal(context: PropContext, element: UI_InputElement) {
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