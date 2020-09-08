import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { NodeEditorPluginId } from '../ui_plugins/node_editor/NodeEditorPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';

export class MeshNodePlugin extends NodePLugin {
    private readonly controller: AbstractController;

    private readonly params: NodeParam[] = [
        {
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ]

    constructor(registry: Registry) {
        super(registry);

        this.controller = new AbstractController(registry.plugins.getById(NodeEditorPluginId), registry);
    
        this.controller.createPropHandler<number>('mesh')
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur((context, element) => {
                element.data.obj.setParam('mesh', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.obj.getParam('mesh'))
            .onGetValues(() => this.registry.stores.canvasStore.getMeshViews().map(meshConcept => meshConcept.id));            
    }

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Mesh,
            params: this.params,
            connections: [
                {
                    direction: 'output',
                    name: 'action'
                }
            ],
            category: NodeCategory.Default
        });
    }

    getController() {
        return this.controller;
    }
}