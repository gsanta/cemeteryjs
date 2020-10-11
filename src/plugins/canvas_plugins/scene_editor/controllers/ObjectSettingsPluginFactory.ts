import { PropController } from "../../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { LayerController, MeshIdController, ModelController, RotationController, ScaleController, TextureController, ThumbnailController, YPosController } from "./MeshSettingsController";
import { ObjectSettingsPlugin, ObjectSettingsPluginId } from "./ObjectSettingsPlugin";
import { PathIdController } from "./PathObjectSettings";
import { FrameName, ManageSpriteSheetsController, ScaleXController, ScaleYController, SelectSpriteSheetController } from "./SpriteSettingsController";

export class ObjectSettingsPluginFactory implements UI_PluginFactory {
    pluginId = ObjectSettingsPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new ObjectSettingsPlugin(registry);
    }

    createPropControllers(plugin: UI_Plugin, registry: Registry): PropController[] {
        return [
            // mesh
            new MeshIdController(),
            new LayerController(),
            new RotationController(),
            new ScaleController(),
            new YPosController(),
            new TextureController(),
            new ModelController(),
            new ThumbnailController(),

            // path
            new PathIdController(),

            // sprite
            new FrameName(),
            new SelectSpriteSheetController(),
            new ManageSpriteSheetsController(),
            new ScaleXController(),
            new ScaleYController()
        ];
    }

    createTools(plugin: UI_Plugin, registry: Registry): Tool[] { return []; }
}