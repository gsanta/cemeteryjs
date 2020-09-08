import { NodeObj } from '../models/game_objects/NodeObj';
import { Registry } from '../Registry';
import { AbstractController } from './controllers/AbstractController';

export abstract class NodePLugin {
    protected readonly registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract createNodeObject(): NodeObj;
    abstract getController(): AbstractController;
}