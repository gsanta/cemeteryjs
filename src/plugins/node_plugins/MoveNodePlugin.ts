import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodeEditorPluginId } from '../node_editor/NodeEditorPlugin';
import { NodeModel, NodeParam } from '../../core/stores/game_objects/NodeModel';
import { Point } from '../../utils/geometry/shapes/Point';
import { defaultNodeViewConfig } from '../../core/stores/views/NodeView';

export class MoveNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    private readonly params: NodeParam[] = [
        {
            name: 'move',
            val: '',
            inputType: 'list',
            valueType: 'string'
        },
        {
            name: 'speed',
            val: 0.5,
            inputType: 'textField',
            valueType: 'number'
        }
    ]

    constructor(registry: Registry) {
        super(registry);

        this.controller = new NodeController(registry.plugins.getById(NodeEditorPluginId), registry);
    
        this.controller.createPropHandler<number>('move')
            .onChange((val, context) => {
                context.updateTempVal(val)
            })
            .onBlur(context => {

            })
            .onGet((context) => {
                return context.getTempVal(() => null)
            });

        this.controller.createPropHandler('speed')
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }

    createNodeObject() {
        return new NodeModel(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height), this.params);
    }

    getController() {
        return this.controller;
    }
}