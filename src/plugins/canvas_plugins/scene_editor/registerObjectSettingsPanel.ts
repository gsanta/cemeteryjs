import { CanvasAxis } from "../../../core/models/misc/CanvasAxis";
import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LightAngleController, LightDiffuseColorController, LightDirController, LightYPosController } from "./views/LightViewControllers";
import { MeshIdController, LayerController, RotationController, ScaleController, YPosController, TextureController, ModelController, ThumbnailController, WidthController, DepthController, HeightController } from "./views/MeshViewControllers";
import { ObjectSettigsRenderer } from "./ObjectSettingsRenderer";
import { PathIdController } from "./views/PathViewControllers";
import { FrameName, SelectSpriteSheetController, ManageSpriteSheetsController, ScaleXController, ScaleYController } from "./views/SpriteViewControllers";

export const ObjectSettingsPanelId = 'object-settings-panel'; 

export function registerObjectSettingsPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, ObjectSettingsPanelId, 'Object Settings');
    panel.renderer = new ObjectSettigsRenderer(registry);

    const propControllers = [
            // mesh
            new MeshIdController(),
            new LayerController(),
            new RotationController(),
            new ScaleController(),
            new YPosController(),
            new TextureController(),
            new ModelController(),
            new ThumbnailController(),
            new WidthController(),
            new DepthController(),
            new HeightController(),

            // path
            new PathIdController(),

            // sprite
            new FrameName(),
            new SelectSpriteSheetController(),
            new ManageSpriteSheetsController(),
            new ScaleXController(),
            new ScaleYController(),

            // light
            new LightYPosController(),
            new LightAngleController(),
            new LightDirController(CanvasAxis.X),
            new LightDirController(CanvasAxis.Y),
            new LightDirController(CanvasAxis.Z),
            new LightDiffuseColorController()
    ];

    panel.controller = new FormController(undefined, registry, propControllers);

    return panel;
}