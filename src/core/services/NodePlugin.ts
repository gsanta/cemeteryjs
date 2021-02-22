import { AnimationNodeType } from '../../modules/graph_editor/main/models/nodes/AnimationNode';
import { RouteNodeObjType } from '../../modules/graph_editor/main/models/nodes/RouteNode';
import { NodeShape, NodeShapeType } from '../../modules/graph_editor/main/models/shapes/NodeShape';
import { NodeObj } from '../models/objs/node_obj/NodeObj';
import { AbstractShape } from '../../modules/graph_editor/main/models/shapes/AbstractShape';
import { FormController } from '../controller/FormController';
import { Registry } from '../Registry';
import { GameState, GameStoreHook } from '../data/stores/GameStore';
import { EmptyShapeStoreHook } from '../data/stores/ShapeStore';
import { AbstractNodeExecutor } from './node/INodeExecutor';

export interface NodeFactory {
    id: string;
    createNodeObj(): NodeObj;
    getController(): FormController;
    createExecutor(): AbstractNodeExecutor<any>;
}

export class NodeGraphHook extends EmptyShapeStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addViewHook(view: AbstractShape) {
        const graph = this.registry.data.helper.node.graph;
        switch(view.viewType) {
            case NodeShapeType:
                graph.addNode((<NodeShape> view).getObj());
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