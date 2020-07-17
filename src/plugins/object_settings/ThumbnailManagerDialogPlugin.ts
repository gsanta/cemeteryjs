import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';

export const ThumbnailManagerDialogPluginId = 'thumbnail-manager-dialog-plugin'; 
export class ThumbnailManagerDialogPlugin extends UI_Plugin {
    id = ThumbnailManagerDialogPluginId;
    region = UI_Region.Dialog;
    displayName = 'Thumbnail manager';

    // constructor() {

    // }

    renderInto(layout: UI_Layout): UI_Layout {
        const row = layout.row();

        // const column2 = tableRow.tableColumn();

        return layout;
    }
}