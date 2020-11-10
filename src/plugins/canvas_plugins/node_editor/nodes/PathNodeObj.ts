import { NodeLink, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PathViewType } from "../../../../core/models/views/PathView";
import { PropController, PropContext, FormController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { NodeRenderer } from "../NodeRenderer";
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

    createView(): NodeView {
        const nodeView = new NodeView();
        nodeView.controller = new FormController(undefined, this.registry, [new PathController(nodeView)]);
        nodeView.renderer = new NodeRenderer(nodeView);
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


    private getParams(): NodeParam[] {
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

    private getOutputLinks(): NodeLink[] {
        return [
            {
                name: 'action'
            }
        ]
    }

    private getInputLinks(): NodeLink[] {
        return [];
    }
}

export class PathController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['path']; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(PathViewType).map(pathView => pathView.id);
    }

    defaultVal() {
        return this.nodeView.getObj().getParam('path').val;
    }

    change(val, context: PropContext) {
        this.nodeView.getObj().setParam('path', val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}