import { UI_Panel, UI_Region } from "../../../../../core/models/UI_Panel";
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
import { SketchEditorModule, SketchEditorPanelId } from "../../../main/SketchEditorModule";
import { ShapeEventType } from "../../../../../core/models/ShapeObservable";

export const ObjectPropertiesPanelId = 'object-properties-panel'; 

export class ObjPropertiesModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, ObjectPropertiesPanelId, 'Object Properties');
        
        const lightSettingsController = new LightPropertiesController(registry);
        const lightSettingsRenderer = new LightPropertiesRenderer(lightSettingsController);
        const spriteSettingsController = new SpritePropertiesController(registry);
        const spriteSettingsRenderer = new SpritePropertiesRenderer(spriteSettingsController);

        const sketchEditorModule = <SketchEditorModule> registry.services.module.ui.getCanvas(SketchEditorPanelId);

        sketchEditorModule.observable.add(eventData => {
            if (eventData.eventType === ShapeEventType.SelectionChanged) {
                const selectedItems = sketchEditorModule.data.selection.getAllItems();
                this.renderer = undefined;
                this.paramController = undefined;
                if (selectedItems.length === 1) {
                    switch(selectedItems[0].viewType) {
                        case MeshShapeType:
                            const meshSettingsController = new MeshPropertiesController(registry, selectedItems[0] as MeshShape);
                            this.paramController = meshSettingsController;
                            this.renderer = new MeshPropertiesRenderer(registry, meshSettingsController);
                        break;
                        case SpriteShapeType:
                            this.renderer = spriteSettingsRenderer;
                            this.paramController = spriteSettingsController;
                        break;
                        case LightShapeType:
                            this.renderer = lightSettingsRenderer;
                            this.paramController = lightSettingsController;
                        break;
                    }
                }
            }
        });
    }
}