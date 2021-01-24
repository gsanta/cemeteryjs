import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LightSettingsRenderer } from "./renderers/LightSettingsRenderer";
import { LightShapeType } from "../../canvas_plugins/scene_editor/models/shapes/LightShape";
import { LightSettingsController } from "./controllers/LightSettingsController";
import { MeshSettingsRenderer } from "./renderers/MeshSettingsRenderer";
import { MeshShape, MeshShapeType } from "../../canvas_plugins/scene_editor/models/shapes/MeshShape";
import { MeshSettingsController } from "./controllers/MeshSettingsController";
import { SpriteSettingsRenderer } from "./renderers/SpriteSettingsRenderer";
import { SpriteShapeType } from "../../canvas_plugins/scene_editor/models/shapes/SpriteShape";
import { SpriteSettingsController } from "./controllers/SpriteSettingsController";

export const ObjectSettingsPanelId = 'object-settings-panel'; 

export function registerObjSettings(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {
    const panel = new UI_Panel(registry, UI_Region.Sidepanel, ObjectSettingsPanelId, 'Object Settings');
    
    const lightSettingsController = new LightSettingsController(registry);
    const lightSettingsRenderer = new LightSettingsRenderer(lightSettingsController);
    const spriteSettingsController = new SpriteSettingsController(registry);
    const spriteSettingsRenderer = new SpriteSettingsRenderer(spriteSettingsController);

    registry.services.event.select.on(() => {
        const selectedViews = registry.data.shape.scene.getSelectedShapes();
        panel.renderer = undefined;
        panel.paramController = undefined;
        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshShapeType:
                    const meshSettingsController = new MeshSettingsController(registry, selectedViews[0] as MeshShape);
                    panel.paramController = meshSettingsController;
                    panel.renderer = new MeshSettingsRenderer(registry, meshSettingsController);
                break;
                case SpriteShapeType:
                    panel.renderer = spriteSettingsRenderer;
                    panel.paramController = spriteSettingsController;
                break;
                case LightShapeType:
                    panel.renderer = lightSettingsRenderer;
                    panel.paramController = lightSettingsController;
                break;
            }
        }
    });

    return panel;
}