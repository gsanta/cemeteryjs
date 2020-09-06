import { NodeObj } from '../models/game_objects/NodeObj';
import { NodeController } from './controllers/NodeController';
import { Registry } from '../Registry';

export abstract class NodePLugin {
    protected readonly registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract createNodeObject(): NodeObj;
    abstract getController(): NodeController;
}