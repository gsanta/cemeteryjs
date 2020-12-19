import { CanvasAxis } from "../../../core/models/misc/CanvasAxis";
import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LightAngleController, LightDiffuseColorController, LightDirController, LightParentMeshController, LightYPosController } from "./views/LightViewControllers";
import { MeshIdController, LayerController, RotationController, ScaleController, TextureController, ModelController, ThumbnailController, WidthController, DepthController, HeightController, ColorController, MeshViewControllerParam, PositionController, CloneController, MeshVisibilityController, MeshNameController } from "./views/MeshViewControllers";
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
            new MeshIdController(registry),
            new LayerController(registry),
            new RotationController(registry, CanvasAxis.X),
            new RotationController(registry, CanvasAxis.Y),
            new RotationController(registry, CanvasAxis.Z),
            new PositionController(registry, CanvasAxis.X),
            new PositionController(registry, CanvasAxis.Y),
            new PositionController(registry, CanvasAxis.Z),
            new ScaleController(registry, CanvasAxis.X),
            new ScaleController(registry, CanvasAxis.Y),
            new ScaleController(registry, CanvasAxis.Z),
            new TextureController(registry),
            new ModelController(registry),
            new ThumbnailController(registry),
            new WidthController(registry),
            new DepthController(registry),
            new HeightController(registry),
            new ColorController(registry),
            new CloneController(registry),
            new MeshVisibilityController(registry),
            new MeshNameController(registry),
            
            // path
            new PathIdController(registry),

            // sprite
            new FrameName(registry),
            new SelectSpriteSheetController(registry),
            new ManageSpriteSheetsController(registry),
            new ScaleXController(registry),
            new ScaleYController(registry),

            // light
            new LightYPosController(registry),
            new LightAngleController(registry),
            new LightDirController(registry, CanvasAxis.X),
            new LightDirController(registry, CanvasAxis.Y),
            new LightDirController(registry, CanvasAxis.Z),
            new LightDiffuseColorController(registry),
            new LightParentMeshController(registry)
    ];

    panel.controller = new FormController(undefined, registry, propControllers);

    return panel;
}