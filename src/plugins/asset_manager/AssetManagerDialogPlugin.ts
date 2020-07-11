import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';


export const AssetManagerDialogPluginId = 'asset_manager_dialog_plugin'; 
export class AssetManagerDialogPlugin extends UI_Plugin {
    id = AssetManagerDialogPluginId;
    region = UI_Region.Dialog;

    renderInto(layout: UI_Layout): UI_Layout {
        const row = layout.row();
        const table = row.table();
        const tableRow = table.tableRow();
        const column1 = tableRow.tableColumn();
        const column2 = tableRow.tableColumn();

        return layout;
    }
}