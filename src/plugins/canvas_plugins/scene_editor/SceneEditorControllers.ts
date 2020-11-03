import { PropController, PropContext } from "../../../core/plugin/controller/FormController";
import { UI_Element } from "../../../core/ui_components/elements/UI_Element";

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.OpenDropdown]; }

    click(context: PropContext, element: UI_Element) {
        // plugin.isShapeDropdownOpen = !plugin.isShapeDropdownOpen;
        // context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        // context.registry.plugins.getToolController(element.pluginId).setSelectedTool(element.targetId);
        // (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).isShapeDropdownOpen = false;
        // (<SceneEditorPlugin> context.registry.plugins.getById(element.pluginId)).activeShapeToolId = element.targetId;
        // context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}
