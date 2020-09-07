import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { NodeEditorPluginId } from '../ui_plugins/node_editor/NodeEditorPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';

export class TurnNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    readonly turns: string[] = ['turn-left', 'turn-right'];


    private readonly params: NodeParam[] = [
        {
            name: 'turn',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ]

    constructor(registry: Registry) {
        super(registry);

        this.controller = new NodeController(registry.plugins.getById(NodeEditorPluginId), registry);
    
        this.controller.createPropHandler<number>('turn')
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur((context, element) => {
                element.data.obj.setParam('turn', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.obj.getParam('turn'))
            .onGetValues(() => this.turns);            
    }

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Turn,
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