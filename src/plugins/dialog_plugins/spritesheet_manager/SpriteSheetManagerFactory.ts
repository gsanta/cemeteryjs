

import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { SpriteSheetManagerDialogPlugin, SpriteSheetManagerDialogPluginId } from "./SpritesheetManagerDialogPlugin";
import { AddSpriteSheetController, SpriteSheetImgController, SpriteSheetJsonPathControl as SpriteSheetJsonPathController } from "./SpritesheetManagerDialogProps";


export class SpriteSheetManagerFactory implements UI_PluginFactory {
    pluginId = SpriteSheetManagerDialogPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return new SpriteSheetManagerDialogPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new SpriteSheetJsonPathController(),
            new SpriteSheetImgController(),
            new AddSpriteSheetController()
        ]
    }

    createTools(): Tool[] { return []; }
}