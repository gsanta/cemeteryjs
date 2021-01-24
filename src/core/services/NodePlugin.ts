import { AnimationNodeType } from '../../plugins/canvas_plugins/node_editor/models/nodes/AnimationNode';
import { RouteNodeObjType } from '../../plugins/canvas_plugins/node_editor/models/nodes/RouteNode';
import { NodeShape, NodeShapeType } from '../../plugins/canvas_plugins/node_editor/models/shapes/NodeShape';
import { NodeObj } from '../models/objs/node_obj/NodeObj';
import { AbstractShape } from '../models/views/AbstractShape';
import { FormController } from '../controller/FormController';
import { Registry } from '../Registry';
import { GameState, GameStoreHook } from '../stores/GameStore';
import { EmptyShapeStoreHook } from '../stores/ShapeStore';
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