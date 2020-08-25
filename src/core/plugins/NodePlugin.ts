import { NodeModel } from '../models/game_objects/NodeModel';
import { NodeController } from './controllers/NodeController';
import { Registry } from '../Registry';

export abstract class NodePLugin {
    protected readonly registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract createNodeObject(): NodeModel;
    abstract getController(): NodeController;
}