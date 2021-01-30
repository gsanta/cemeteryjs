import { FormController } from "../../../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { ClearThumbnailControl, ThumbnailCreateControl, ThumbnailUploadControl } from "./ThumbnailDialogProps";
import { ThumbnailDialogRenderer } from "./ThumbnailDialogRenderer";

export const ThumbnailDialogPanelId = 'thumbnail-dialog-panel';

export class ThumbnailDialogModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Dialog, ThumbnailDialogPanelId, 'Thumbnail Dialog');
        
        const propControllers = [
            new ThumbnailCreateControl(registry),
            new ThumbnailUploadControl(registry),
            new ClearThumbnailControl(registry)
        ];
    
        this.controller = new FormController(undefined, registry, propControllers);
        this.renderer = new ThumbnailDialogRenderer(registry)
    }
}