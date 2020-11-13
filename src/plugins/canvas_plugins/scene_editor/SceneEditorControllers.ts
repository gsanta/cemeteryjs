import { AbstractCanvasPanel } from "../../../core/plugin/AbstractCanvasPanel";
import { PropController, PropContext } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { UI_Element } from "../../../core/ui_components/elements/UI_Element";
import { SceneEditorRenderer } from "./SceneEditorRenderer";

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.OpenDropdown]; }

    click(context: PropContext, element: UI_Element) {
        const renderer = element.canvasPanel.renderer as SceneEditorRenderer;
        renderer.isShapeDropdownOpen = !renderer.isShapeDropdownOpen;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends PropController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.SelectPrimitiveShape]; }

    click(context: PropContext, element: UI_Element) {
        const renderer = element.canvasPanel.renderer as SceneEditorRenderer;
        element.canvasPanel.toolController.setSelectedTool(element.key);
        renderer.isShapeDropdownOpen = false;
        renderer.activeShapeToolId = element.key;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}
