import { ThinTexture } from "babylonjs/Materials/Textures/thinTexture";
import { CanvasEventType } from "../../../../../core/models/CanvasObservable";
import { LightObjType } from "../../../../../core/models/objs/LightObj";
import { MeshObj, MeshObjType } from "../../../../../core/models/objs/MeshObj";
import { SpriteObjType } from "../../../../../core/models/objs/SpriteObj";
import { UI_Panel, UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { SceneEditorCanvas, SceneEditorPanelId } from "../../../main/SceneEditorCanvas";
import { LightPropertiesController } from "./controllers/LightPropertiesController";
import { MeshPropertiesController } from "./controllers/MeshPropertiesController";
import { SpritePropertiesController } from "./controllers/SpritePropertiesController";
import { LightPropertiesRenderer } from "./renderers/LightPropertiesRenderer";
import { MeshPropertiesRenderer } from "./renderers/MeshPropertiesRenderer";
import { SpritePropertiesRenderer } from "./renderers/SpritePropertiesRenderer";

export const ObjectPropertiesPanelId = 'object-properties-panel'; 

export class ObjPropertiesModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, ObjectPropertiesPanelId, 'Object Properties');
        
        const lightSettingsController = new LightPropertiesController(registry);
        const lightSettingsRenderer = new LightPropertiesRenderer(lightSettingsController);
        const spriteSettingsController = new SpritePropertiesController(registry);
        const spriteSettingsRenderer = new SpritePropertiesRenderer(spriteSettingsController);

        const sceneEditorModule = <SceneEditorCanvas> registry.services.module.ui.getCanvas(SceneEditorPanelId);

        sceneEditorModule.observable.add(eventData => {
            if (eventData.eventType === CanvasEventType.TagChanged) {
                const selectedItems = sceneEditorModule.data.items.getByTag('select');
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

                    this.registry.services.render.reRender(UI_Region.Sidepanel);
                }
            }
        });
    }
}