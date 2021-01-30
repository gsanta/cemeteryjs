import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { ParamController, PropContext } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";
import { SketchEditorRenderer } from "../../../main/renderers/SketchEditorRenderer";
import { CubeToolId } from "../../../main/controllers/tools/CubeTool";
import { GroundToolId } from "../../../main/controllers/tools/GroundTool";
import { SphereToolId } from "../../../main/controllers/tools/SphereTool";

export enum SceneEditorToolbarProps {
    SelectPrimitiveShape = 'select-primitive-shape',
    OpenDropdown = 'open-dropdown'
}

export class PrimitiveShapeDropdownMenuOpenControl extends ParamController<any> {
    acceptedProps() { return [SceneEditorToolbarProps.OpenDropdown]; }

    click(context: PropContext, element: UI_Element) {
        const renderer = element.canvasPanel.renderer as SketchEditorRenderer;
        renderer.isShapeDropdownOpen = !renderer.isShapeDropdownOpen;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class PrimitiveShapeDropdownControl extends ParamController<any> {
    acceptedProps() { return [CubeToolId, SphereToolId, GroundToolId]; }

    click(context: PropContext, element: UI_Element) {
        const renderer = element.canvasPanel.renderer as SketchEditorRenderer;
        element.canvasPanel.tool.setSelectedTool(element.key);
        renderer.isShapeDropdownOpen = false;
        renderer.activeShapeToolId = element.key;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}
