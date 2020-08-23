import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, GeneralNodeModel, NodeCategory, NodeParam } from '../../core/stores/game_objects/NodeModel';
import { NodeEditorPluginId } from '../node_editor/NodeEditorPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { getAllKeys } from '../../core/stores/nodes/KeyboardNode';

export class KeyboardNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    private readonly params: NodeParam[] = [
        {
            name: 'key',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ]

    constructor(registry: Registry) {
        super(registry);

        this.controller = new NodeController(registry.plugins.getById(NodeEditorPluginId), registry);
    
        this.controller.createPropHandler<number>('key')
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur((context, element) => {
                element.data.model.setParam('key', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.model.getParam('key'))
            .onGetValues(() => getAllKeys());            
    }

    createNodeObject(): GeneralNodeModel {
        return new GeneralNodeModel({
            type: BuiltinNodeType.Keyboard,
            params: this.params,
            connections: [
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