import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { NodeEditorPluginId } from '../ui_plugins/node_editor/NodeEditorPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';

export class PathNodePlugin extends NodePLugin {
    private readonly controller: AbstractController;

    private readonly params: NodeParam[] = [
        {
            name: 'path',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ];

    constructor(registry: Registry) {
        super(registry);

        this.controller = new AbstractController(registry.plugins.getById(NodeEditorPluginId), registry);
    
        this.controller.createPropHandler<number>('path')
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur((context, element) => {
                element.data.obj.setParam('path', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.obj.getParam('path'))
            .onGetValues(() => this.registry.stores.canvasStore.getPathViews().map(path => path.id));            
    }

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Path,
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