import { UI_Panel, UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { LightPropertiesRenderer } from "./renderers/LightPropertiesRenderer";
import { LightShapeType } from "../../../main/models/shapes/LightShape";
import { LightPropertiesController } from "./controllers/LightPropertiesController";
import { MeshPropertiesRenderer } from "./renderers/MeshPropertiesRenderer";
import { MeshShape, MeshShapeType } from "../../../main/models/shapes/MeshShape";
import { MeshPropertiesController } from "./controllers/MeshPropertiesController";
import { SpritePropertiesRenderer } from "./renderers/SpritePropertiesRenderer";
import { SpriteShapeType } from "../../../main/models/shapes/SpriteShape";
import { SpritePropertiesController } from "./controllers/SpritePropertiesController";

export const ObjectPropertiesPanelId = 'object-properties-panel'; 

export function registerObjProperties(registry: Registry) {
    const panel = createPanel(registry);

    registry.services.module.ui.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {
    const panel = new UI_Panel(registry, UI_Region.Sidepanel, ObjectPropertiesPanelId, 'Object Settings');
    
    const lightSettingsController = new LightPropertiesController(registry);
    const lightSettingsRenderer = new LightPropertiesRenderer(lightSettingsController);
    const spriteSettingsController = new SpritePropertiesController(registry);
    const spriteSettingsRenderer = new SpritePropertiesRenderer(spriteSettingsController);

    registry.services.event.select.on(() => {
        const selectedViews = registry.data.shape.scene.getSelectedShapes();
        panel.renderer = undefined;
        panel.paramController = undefined;
        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshShapeType:
                    const meshSettingsController = new MeshPropertiesController(registry, selectedViews[0] as MeshShape);
                    panel.paramController = meshSettingsController;
                    panel.renderer = new MeshPropertiesRenderer(registry, meshSettingsController);
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