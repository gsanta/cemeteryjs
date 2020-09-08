import { NodePLugin } from '../../core/plugins/NodePlugin';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';

export class SplitNodePlugin extends NodePLugin {
    private readonly controller: AbstractController;

    private readonly params: NodeParam[] = []

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Split,
            params: this.params,
            connections: [
                {
                    direction: 'input',
                    name: 'input'
                },
                {
                    direction: 'output',
                    name: 'output1'
                },
                {
                    direction: 'output',
                    name: 'output2'
                },
                {
                    direction: 'output',
                    name: 'output3'
                },
                {
                    direction: 'output',
                    name: 'output4'
                }
            ],
            category: NodeCategory.Default
        });
    }

    getController() {
        return this.controller;
    }
}