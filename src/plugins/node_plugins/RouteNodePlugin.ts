import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { BuiltinNodeType, GeneralNodeModel, NodeCategory, NodeParam } from '../../core/stores/game_objects/NodeModel';

export class RouteNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    private readonly params: NodeParam[] = [
        {
            name: 'route',
            val: '',
            inputType: 'textField',
            valueType: 'string'
        }
    ]

    createNodeObject(): GeneralNodeModel {
        return new GeneralNodeModel({
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