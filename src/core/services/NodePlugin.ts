import { AnimationNodeType } from '../../plugins/canvas_plugins/node_editor/nodes/AnimationNode';
import { RouteNodeObjType } from '../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNode';
import { NodeObj } from '../models/objs/NodeObj';
import { NodeView, NodeViewType } from '../models/views/NodeView';
import { View } from '../models/views/View';
import { FormController } from '../plugin/controller/FormController';
import { Registry } from '../Registry';
import { GameState, GameStoreHook } from '../stores/GameStore';
import { EmptyViewStoreHook } from '../stores/ViewStore';
import { AbstractNodeExecutor } from './node/INodeExecutor';

export interface NodeFactory {
    id: string;
    createNodeObj(): NodeObj;
    getController(): FormController;
    createExecutor(): AbstractNodeExecutor<any>;
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