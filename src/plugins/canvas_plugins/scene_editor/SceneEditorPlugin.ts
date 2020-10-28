import { MeshViewType } from '../../../core/models/views/MeshView';
import { PathViewType } from '../../../core/models/views/PathView';
import { SpriteViewType } from '../../../core/models/views/SpriteView';
import { sortViewsByLayer, View } from '../../../core/models/views/View';
import { RedoProp, UndoProp, ZoomInProp, ZoomOutProp } from '../../../core/plugin/AbstractCanvasPlugin';
import { Canvas_2d_Plugin } from '../../../core/plugin/Canvas_2d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { MeshToolId, MeshTool } from './tools/MeshTool';
import { PropController, PropContext } from '../../../core/plugin/controller/FormController';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { SelectToolId } from '../../../core/plugin/tools/SelectTool';
import { PathToolId } from './tools/PathTool';
import { CameraToolId } from '../../../core/plugin/tools/CameraTool';
import { DeleteToolId } from '../../../core/plugin/tools/DeleteTool';
import { SpriteToolId } from './tools/SpriteTool';
import { UI_Toolbar } from '../../../core/ui_components/elements/toolbar/UI_Toolbar';
import { CubeToolId } from './tools/CubeTool';
import { SphereToolId } from './tools/SphereTool';
import { ScaleToolId } from './tools/ScaleTool';
import { AxisToolId } from './tools/AxisTool';

export const SceneEditorPluginId = 'scene-editor-plugin';
export class SceneEditorPlugin extends Canvas_2d_Plugin {

    constructor(registry: Registry) {
        super(SceneEditorPluginId, registry);
    }

    destroy() { 
        this.registry.stores.views.clearSelection();
    }
}

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.OpenDropdown]; }

    click(context: PropContext, element: UI_Element) {
        const plugin = <SceneEditorPlugin> context.registry.plugins.getById(element.pluginId);
        plugin.isShapeDropdownOpen = !plugin.isShapeDropdownOpen;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        context.registry.plugins.getToolController(element.pluginId).setSelectedTool(element.targetId);
        (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).isShapeDropdownOpen = false;
        (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).activeShapeToolId = element.targetId;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}
