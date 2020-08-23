import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { BuiltinNodeType, GeneralNodeModel, NodeCategory, NodeParam } from '../../core/stores/game_objects/NodeModel';

export class AndNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    private readonly params: NodeParam[] = []

    createNodeObject(): GeneralNodeModel {
        return new GeneralNodeModel({
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