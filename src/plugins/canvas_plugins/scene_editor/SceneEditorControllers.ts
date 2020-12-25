import { ListController, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { SceneEditorPanelId } from "./registerSceneEditor";
import { SceneEditorRenderer } from "./SceneEditorRenderer";

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends PropController {
    click() {
        const renderer = this.registry.ui.canvas.getCanvas(SceneEditorPanelId).renderer as SceneEditorRenderer;
        renderer.isShapeDropdownOpen = !renderer.isShapeDropdownOpen;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends ListController {
    select(val: string) {
        const sceneEditor = this.registry.ui.canvas.getCanvas(SceneEditorPanelId);
        const renderer = <SceneEditorRenderer> sceneEditor.renderer;
        sceneEditor.toolController.setSelectedTool(val);
        renderer.isShapeDropdownOpen = false;
        renderer.activeShapeToolId = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}
