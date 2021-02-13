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
import { SceneEditorModule, SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorModule";
import { CanvasEventType } from "../../../../../core/models/CanvasObservable";
import { MeshObj, MeshObjType } from "../../../../../core/models/objs/MeshObj";
import { SpriteObjType } from "../../../../../core/models/objs/SpriteObj";
import { LightObjType } from "../../../../../core/models/objs/LightObj";

export const ObjectPropertiesPanelId = 'object-properties-panel'; 

export class ObjPropertiesModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, ObjectPropertiesPanelId, 'Object Properties');
        
        const lightSettingsController = new LightPropertiesController(registry);
        const lightSettingsRenderer = new LightPropertiesRenderer(lightSettingsController);
        const spriteSettingsController = new SpritePropertiesController(registry);
        const spriteSettingsRenderer = new SpritePropertiesRenderer(spriteSettingsController);

        const sketchEditorModule = <SceneEditorModule> registry.services.module.ui.getCanvas(SceneEditorPanelId);

        sketchEditorModule.observable.add(eventData => {
            if (eventData.eventType === CanvasEventType.SelectionChanged) {
                const selectedItems = sketchEditorModule.data.selection.getAllItems();
                this.renderer = undefined;
                this.paramController = undefined;
                if (selectedItems.length === 1) {
                    switch(selectedItems[0].objType) {
                        case MeshObjType:
                            const meshSettingsController = new MeshPropertiesController(registry, selectedItems[0] as MeshObj);
                            this.paramController = meshSettingsController;
                            this.renderer = new MeshPropertiesRenderer(registry, meshSettingsController);
                        break;
                        case SpriteObjType:
                            this.renderer = spriteSettingsRenderer;
                            this.paramController = spriteSettingsController;
                        break;
                        case LightObjType:
                            this.renderer = lightSettingsRenderer;
                            this.paramController = lightSettingsController;
                        break;
                    }
                }
            }
        });
    }
}