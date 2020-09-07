import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { NodeEditorPluginId } from '../ui_plugins/node_editor/NodeEditorPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';

export class MoveNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    private movementTypes: string[] = ['forward', 'backward'];

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
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur(context => {

            })
            .onGet((context, element) => element.data.obj.getParam('move'))
            .onGetValues(() => this.movementTypes);

        this.controller.createPropHandler('speed')
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur((context, element) => {
                element.data.obj.setParam('speed', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.obj.getParam('speed'));
            
    }

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Move,
            params: this.params,
            connections: [
                {
                    direction: 'input',
                    name: 'input'
                },
                {
                    direction: 'input',
                    name: 'mesh'
                },
                {
                    direction: 'output',
                    name: 'animation'
                }
            ],
            category: NodeCategory.Default
        });
    }

    getController() {
        return this.controller;
    }
}