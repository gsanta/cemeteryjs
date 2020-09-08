import { NodePLugin } from '../../core/plugins/NodePlugin';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';

export class RouteNodePlugin extends NodePLugin {
    private readonly controller: AbstractController;

    private readonly params: NodeParam[] = [
        {
            name: 'route',
            val: '',
            inputType: 'textField',
            valueType: 'string'
        }
    ];

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Route,
            params: this.params,
            connections: [
                {
                    direction: 'input',
                    name: 'mesh'
                },
                {
                    direction: 'input',
                    name: 'path'
                },
                {
                    direction: 'output',
                    name: 'onStart'
                },
                {
                    direction: 'output',
                    name: 'onTurnStart'
                },
                {
                    direction: 'output',
                    name: 'onTurnEnd'
                },
                {
                    direction: 'output',
                    name: 'onFinish'
                }
            ],
            category: NodeCategory.Default
        });
    }

    getController() {
        return this.controller;
    }
}