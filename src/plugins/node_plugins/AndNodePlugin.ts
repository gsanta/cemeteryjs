import { NodePLugin } from '../../core/plugins/NodePlugin';
import { BuiltinNodeType, NodeCategory, NodeObj, NodeParam } from '../../core/models/game_objects/NodeObj';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';

export class AndNodePlugin extends NodePLugin {
    private readonly controller: AbstractController;

    private readonly params: NodeParam[] = []

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.And,
            params: this.params,
            connections: [
                {
                    direction: 'input',
                    name: 'input1'
                },
                {
                    direction: 'input',
                    name: 'input2'
                },
                {
                    direction: 'output',
                    name: 'output'
                }
            ],
            category: NodeCategory.Default
        });
    }

    getController() {
        return this.controller;
    }
}