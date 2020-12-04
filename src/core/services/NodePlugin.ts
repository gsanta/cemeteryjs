import { AnimationNodeType } from '../../plugins/canvas_plugins/node_editor/nodes/AnimationNode';
import { RouteNodeObjType } from '../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNode';
import { NodeObj } from '../models/objs/NodeObj';
import { JoinPointView } from '../models/views/child_views/JoinPointView';
import { NodeConnectionView, NodeConnectionViewType } from '../models/views/NodeConnectionView';
import { NodeView, NodeViewType } from '../models/views/NodeView';
import { View } from '../models/views/View';
import { FormController } from '../plugin/controller/FormController';
import { Registry } from '../Registry';
import { GameState, GameStoreHook } from '../stores/GameStore';
import { EmptyViewStoreHook } from '../stores/ViewStore';
import { INodeExecutor } from './node/INodeExecutor';

export interface NodeFactory {
    id: string;
    createNodeObj(): NodeObj;
    getController(): FormController;
    createExecutor(): INodeExecutor;
}

class RemoveRelatedConnectionHook extends EmptyViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addViewHook() {}

    removeViewHook(view: View) {
        switch(view.viewType) {
            case NodeViewType:
                this.removeRelatedConnections(<NodeView> view)
            break;
            case NodeConnectionViewType:
                this.removeConnectionFromNode(<NodeConnectionView> view);
            break;
        }
    }

    private removeRelatedConnections(nodeView: NodeView) {
        nodeView.containedViews.forEach((joinPointView: JoinPointView) => {
            if (joinPointView.connection) {
                this.registry.data.view.node.removeView(joinPointView.connection);
            }
        });
    }

    private removeConnectionFromNode(nodeConnectionView: NodeConnectionView) {
        const joinPointView1 = nodeConnectionView.joinPoint1;
        if (joinPointView1 && this.registry.data.view.node.hasView(joinPointView1.containerView.id)) {
            joinPointView1.connection = undefined;
        }

        const joinPointView2 = nodeConnectionView.joinPoint2;
        if (joinPointView2 && this.registry.data.view.node.hasView(joinPointView2.containerView.id)) {
            joinPointView2.connection = undefined;
        }
    }
}

export class NodeGraphHook extends EmptyViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addViewHook(view: View) {
        const graph = this.registry.data.helper.node.graph;
        switch(view.viewType) {
            case NodeViewType:
                graph.addNode((<NodeView> view).getObj());
            break;
        }
    }
}

const gameStateHook: GameStoreHook = (registry: Registry, prop: string, val: GameState) => {
    const playableNodes = [
        ...registry.data.helper.node.graph.getNodesByType(RouteNodeObjType),
        ...registry.data.helper.node.graph.getNodesByType(AnimationNodeType),
    ];

    playableNodes.forEach(node => {
        if (val === 'running') {
            node.getObj().startExecution();
        } else if (val === 'paused') {
            node.getObj().stopExecution();
        }
    });
}