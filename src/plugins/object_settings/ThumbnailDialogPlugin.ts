import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin'; 
export class ThumbnailDialogPlugin extends UI_Plugin {
    id = ThumbnailDialogPluginId;
    region = UI_Region.Dialog;
    displayName = 'Thumbnail';

    // constructor() {

    // }

    renderInto(layout: UI_Layout): UI_Layout {
        const row = layout.row(null);

        // const column2 = tableRow.tableColumn();

        return layout;
    }
}