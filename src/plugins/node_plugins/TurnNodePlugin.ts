import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, GeneralNodeModel, NodeCategory, NodeParam } from '../../core/stores/game_objects/NodeModel';
import { NodeEditorPluginId } from '../node_editor/NodeEditorPlugin';
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
                element.data.model.setParam('turn', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.model.getParam('turn'))
            .onGetValues(() => this.turns);            
    }

    createNodeObject(): GeneralNodeModel {
        return new GeneralNodeModel({
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