import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LightSettingsRenderer } from "./renderers/LightSettingsRenderer";
import { LightViewType } from "../../canvas_plugins/scene_editor/models/views/LightView";
import { LightSettingsController } from "./controllers/LightSettingsController";
import { MeshSettingsRenderer } from "./renderers/MeshSettingsRenderer";
import { MeshView, MeshViewType } from "../../canvas_plugins/scene_editor/models/views/MeshView";
import { MeshSettingsController } from "./controllers/MeshSettingsController";
import { SpriteSettingsRenderer } from "./renderers/SpriteSettingsRenderer";
import { SpriteViewType } from "../../canvas_plugins/scene_editor/models/views/SpriteView";
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
        const selectedViews = registry.data.view.scene.getSelectedViews();
        panel.renderer = undefined;
        panel.paramController = undefined;
        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshViewType:
                    const meshSettingsController = new MeshSettingsController(registry, selectedViews[0] as MeshView);
                    panel.paramController = meshSettingsController;
                    panel.renderer = new MeshSettingsRenderer(registry, meshSettingsController);
                break;
                case SpriteViewType:
                    panel.renderer = spriteSettingsRenderer;
                    panel.paramController = spriteSettingsController;
                break;
                case LightViewType:
                    panel.renderer = lightSettingsRenderer;
                    panel.paramController = lightSettingsController;
                break;
            }
        }
    });

    return panel;
}