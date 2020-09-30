import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { FormController, PropController } from "../../../core/plugin/controller/FormController";
import { ToolController } from "../../../core/plugin/controller/ToolController";
import { UI_Controller } from "../../../core/plugin/controller/UI_Controller";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { ThumbnailDialogPlugin, ThumbnailDialogPluginId } from "./ThumbnailDialogPlugin";
import { ClearThumbnailControl, ThumbnailCreateControl, ThumbnailUploadControl } from "./ThumbnailDialogProps";

export const ThumbnailToolControllerId = 'thumbnail-tool-controller';
export const ThumbnailFormControllerId = 'thumbnail-form-controller';

export class ThumbnailDialogPluginFactory implements PluginFactory {
    pluginId = ThumbnailDialogPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new ThumbnailDialogPlugin(registry);
    }

    createControllers(plugin: UI_Plugin, registry: Registry): UI_Controller[] {
        const toolController = new ToolController(ThumbnailToolControllerId, plugin as AbstractCanvasPlugin, registry);

        toolController.registerTool(new CameraTool(plugin as AbstractCanvasPlugin, toolController, registry));

        const props: PropController[] = [
            new ThumbnailCreateControl(),
            new ThumbnailUploadControl(),
            new ClearThumbnailControl()
        ];

        const formController = new FormController(plugin as AbstractCanvasPlugin, registry, ThumbnailFormControllerId, props);
        
        return [toolController, formController];
    }
}