import { NodeController } from '../../core/plugins/controllers/NodeController';
import { NodePLugin } from '../../core/plugins/NodePlugin';
import { Registry } from '../../core/Registry';
import { BuiltinNodeType, NodeObj, NodeCategory, NodeParam } from '../../core/models/game_objects/NodeObj';
import { NodeEditorPluginId } from '../ui_plugins/node_editor/NodeEditorPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { AbstractController, PropControl } from '../../core/plugins/controllers/AbstractController';
import { UI_InputElement } from '../../core/ui_components/elements/UI_InputElement';
import { NodeViewJson, NodeView } from '../../core/models/views/NodeView';

export class AnimationNodePlugin extends NodePLugin {
    private readonly controller: NodeController;

    readonly animations: string[] = ['animation1', 'animation2'];


    private readonly params: NodeParam[] = [
        {
            name: 'mesh',
            val: '',
            inputType: 'list',
            valueType: 'string'
        },
        {
            name: 'animation',
            val: '',
            inputType: 'list',
            valueType: 'string'
        }
    ]

    constructor(registry: Registry) {
        super(registry);

        this.controller = new NodeController(registry.plugins.getById(NodeEditorPluginId), registry);
        this.controller.registerPropControl('mesh', MeshPropControl);

        this.controller.createPropHandler<number>('animation')
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
            .onBlur((context, element) => {
                element.data.obj.setParam('animation', context.clearTempVal());
                this.registry.services.render.reRenderAll();
            })
            .onGet((context, element) => element.data.obj.getParam('animation'))
            .onGetValues(() => this.animations);            
    }

    createNodeObject(): NodeObj {
        return new NodeObj({
            type: BuiltinNodeType.Animation,
            params: this.params,
            connections: [
                {
                    direction: 'input',
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

const MeshPropControl: PropControl<string> = {
    values(context) {
        return context.registry.stores.canvasStore.getMeshViews().map(meshView => meshView.id);
    },
    
    defaultVal(context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        const meshParam = nodeView.obj.getParam('mesh').val;
        return context.registry.stores.canvasStore.getById(meshParam)?.id;
    },

    change(val: string, context, element: UI_InputElement) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        nodeView.obj.setParam('mesh', val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

// const AnimationPropControl: PropControl<string> = {
//     values(context) {
//         context.registry.stores.canvasStore.getMeshViews().map(meshView => meshView.id);
//     },
    
//     defaultVal(context, element: UI_InputElement) {
//         const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
//         const meshParam = nodeView.obj.getParam('mesh').val;
//         return context.registry.stores.canvasStore.getById(meshParam)?.id;
//     },

//     change(val: string, context, element: UI_InputElement) {
//         const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
//         nodeView.obj.setParam('mesh', val);
//         context.registry.services.render.reRender(UI_Region.Canvas1);
//     }
// }