import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LightSettingsRenderer } from "./views/LightSettingsRenderer";
import { LightViewType } from "./views/LightView";
import { LightViewControllers } from "./views/LightViewControllers";
import { MeshSettingsRenderer } from "./views/MeshSettingsRenderer";
import { MeshViewType } from "./views/MeshView";
import { MeshViewControllers } from "./views/MeshViewControllers";
import { SpriteSettingsRenderer } from "./views/SpriteSettingsRenderer";
import { SpriteViewType } from "./views/SpriteView";
import { SpriteViewControllers } from "./views/SpriteViewControllers";

export const ObjectSettingsPanelId = 'object-settings-panel'; 

export function registerObjectSettingsPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {
    const panel = new UI_Panel(registry, UI_Region.Sidepanel, ObjectSettingsPanelId, 'Object Settings');
    
    const meshSettingsController = new MeshViewControllers(registry);
    const meshSettingsRenderer = new MeshSettingsRenderer(registry, meshSettingsController);
    const lightSettingsController = new LightViewControllers(registry);
    const lightSettingsRenderer = new LightSettingsRenderer(lightSettingsController);
    const spriteSettingsController = new SpriteViewControllers(registry);
    const spriteSettingsRenderer = new SpriteSettingsRenderer(spriteSettingsController);

    registry.services.event.select.on(() => {
        const selectedViews = registry.data.view.scene.getSelectedViews();
        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshViewType:
                    panel.renderer = meshSettingsRenderer;
                    panel.paramController = meshSettingsController;
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