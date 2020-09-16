import { BuiltinNodeType, NodeObj } from '../models/game_objects/NodeObj';
import { NodeView } from '../models/views/NodeView';
import { Registry } from '../Registry';
import { AbstractViewStore } from './AbstractViewStore';

export class NodeStore extends AbstractViewStore<NodeView> {
    static id = 'node-store'; 
    id = NodeStore.id;

    templates: NodeObj[] = [];
    actionTypes: string[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        for (let item in BuiltinNodeType) {
            if (isNaN(Number(item))) {
                this.actionTypes.push(item);
            }
        }
    }
}