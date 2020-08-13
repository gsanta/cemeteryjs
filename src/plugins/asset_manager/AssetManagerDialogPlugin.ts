import { UI_Plugin, UI_Region } from '../../core/plugins/UI_Plugin';
import { UI_Layout } from '../../core/ui_regions/elements/UI_Layout';
import { UI_Table } from '../../core/ui_regions/elements/UI_Table';
import { AssetType } from '../../core/stores/game_objects/AssetObject';
import { Registry } from '../../core/Registry';
import { AssetManagerDialogControllerId, AssetManagerDialogController, AssetManagerDialogProps } from './AssetManagerDialogController';
import { UI_Dialog } from '../../core/ui_regions/elements/surfaces/UI_Dialog';

export const AssetManagerDialogPluginId = 'asset-manager-dialog-plugin'; 
export class AssetManagerDialogPlugin extends UI_Plugin {
    id = AssetManagerDialogPluginId;
    region = UI_Region.Dialog;
    displayName = 'Asset manager';


    constructor(registry: Registry) {
        super(registry);

        
        this.controllers.set(AssetManagerDialogControllerId, new AssetManagerDialogController(this, registry));
    }


    renderInto(layout: UI_Dialog): UI_Layout {
        layout.controllerId = AssetManagerDialogControllerId;
        layout.width = '530px';
        // layout.controllerId = AssetManagere;

        const row = layout.row({ key: '1' });

        const table = row.table(null);
        table.columnWidths = [150, 150, 150, 50];
        table.width = 500;

        this.renderTableHeader(table);
        this.renderModelRows(table);

        // const column2 = tableRow.tableColumn();

        return layout;
    }

    private renderTableHeader(table: UI_Table) {
        const tableRow = table.tableRow({isHeader: true});
        tableRow.isHeader = true;
        
        let header = tableRow.tableColumn(null);
        let text = header.text();
        text.text = 'Model id';

        header = tableRow.tableColumn(null);
        text = header.text();
        text.text = 'Name';

        header = tableRow.tableColumn(null);
        text = header.text();
        text.text = 'Relative path';

        header = tableRow.tableColumn(null);
        header.width = 100;
    }

    private renderModelRows(table: UI_Table) {
        let tableRowGroup = table.tableRowGroup({key: 'model'});
        tableRowGroup.text = 'Model';

        this.registry.stores.assetStore.getByType(AssetType.Model).forEach(asset => {
            const tableRow = table.tableRow({ isHeader: false });

            let column = tableRow.tableColumn(null);
            let text = column.text();
            text.text = asset.id;
    
            column = tableRow.tableColumn(null);
            text = column.text();
            text.text = asset.name ? asset.name : '-';
    
            column = tableRow.tableColumn(null);
            text = column.text();
            text.text = asset.path ? asset.path : '-';

            column = tableRow.tableColumn(null);
            column.width = 100;

            const iconRow = column.row({ key: 'icons' });

            let icon = iconRow.icon({ prop: null });
            icon.iconName = 'brush';
            icon.listItemId = asset.id;

            icon = iconRow.icon({ prop: AssetManagerDialogProps.DeleteAsset });
            icon.iconName = 'remove';
            icon.listItemId = asset.id;
        });
    }
}