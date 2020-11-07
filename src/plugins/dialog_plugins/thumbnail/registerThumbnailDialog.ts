import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { ClearThumbnailControl, ThumbnailCreateControl, ThumbnailUploadControl } from "./ThumbnailDialogProps";

export const ThumbnailDialogPanelId = 'thumbnail-dialog-panel';

export function registerThumbnaildialog(registry: Registry) {
    const panel = createDialog(registry);

    registry.ui.panel.registerPanel(panel);
}

function createDialog(registry: Registry): UI_Panel {
    const propControllers = [
        new ThumbnailCreateControl(),
        new ThumbnailUploadControl(),
        new ClearThumbnailControl()
    ];

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, ThumbnailDialogPanelId, 'Thumbnail Dialog');
    panel.controller = new FormController(undefined, registry, propControllers);

    return panel;
}