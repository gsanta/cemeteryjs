import { AssetType, AssetObj } from "../../../../core/models/objs/AssetObj";
import { IRenderer } from "../../../../core/plugin/IRenderer";
import { Registry } from "../../../../core/Registry";
import { UI_Dialog } from "../../../../core/ui_components/elements/surfaces/dialog/UI_Dialog";
import { UI_Table } from "../../../../core/ui_components/elements/UI_Table";
import { AssetManagerDialogProps } from "./AssetManagerProps";

export class AssetManagerDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;

    // TODO find a better place to store temporary data
    editedAsset: AssetObj;
    tempAssetName: string;
    tempAssetPath: string;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(dialog: UI_Dialog): void {
        dialog.width = '530px';

        const row = dialog.row({ key: '1' });

        const table = row.table();
        table.columnWidths = [150, 150, 150, 54];
        table.width = 500;

        this.renderTableHeader(table);
        this.renderModelRows(table);
    }

    private renderTableHeader(table: UI_Table) {
        const tableRow = table.tableRow({isHeader: true});
        tableRow.isHeader = true;
        
        let header = tableRow.tableColumn();
        let text = header.text();
        text.text = 'Model id';

        header = tableRow.tableColumn();
        text = header.text();
        text.text = 'Name';

        header = tableRow.tableColumn();
        text = header.text();
        text.text = 'Relative path';

        header = tableRow.tableColumn();
        header.width = 100;
    }

    private renderModelRows(table: UI_Table) {
        let tableRowGroup = table.tableRowGroup({key: 'model'});
        tableRowGroup.text = 'Model';

        this.registry.stores.assetStore.getByType(AssetType.Model).forEach(asset => {
            if (asset === this.editedAsset) {
                this.renderEditableModel(table, asset);
            } else {
                this.renderReadOnlyModel(table, asset);
            }
        });
    }

    private renderReadOnlyModel(table: UI_Table, asset: AssetObj) {
        const tableRow = table.tableRow({ isHeader: false });

        let column = tableRow.tableColumn();
        let text = column.text();
        text.text = asset.id;

        column = tableRow.tableColumn();
        text = column.text();
        text.text = asset.name ? asset.name : '-';

        column = tableRow.tableColumn();
        text = column.text();
        text.text = asset.path ? asset.path : '-';

        column = tableRow.tableColumn();
        column.width = 100;

        const iconRow = column.row({ key: 'icons' });

        let icon = iconRow.icon({ key: AssetManagerDialogProps.EnterEditMode });
        icon.iconName = 'brush';
        icon.listItemId = asset.id;
        let tooltip = icon.tooltip();
        tooltip.label = 'Edit';

        icon = iconRow.icon({ key: AssetManagerDialogProps.DeleteAsset });
        icon.iconName = 'delete';
        icon.listItemId = asset.id;
        icon.variant = 'danger';
        tooltip = icon.tooltip();
        tooltip.label = 'Delete';
    }

    private renderEditableModel(table: UI_Table, asset: AssetObj) {
        const tableRow = table.tableRow({ isHeader: false });

        let column = tableRow.tableColumn();
        let text = column.text();
        text.text = asset.id;

        column = tableRow.tableColumn();
        let textField = column.textField({key: AssetManagerDialogProps.AssetName});

        column = tableRow.tableColumn();
        textField = column.textField({key: AssetManagerDialogProps.AssetPath});

        column = tableRow.tableColumn();
        column.width = 100;

        const iconRow = column.row({ key: 'icons' });

        let icon = iconRow.icon({ key: AssetManagerDialogProps.SaveEdit });
        icon.iconName = 'done';
        icon.listItemId = asset.id;
        icon.variant = 'success';
        let tooltip = icon.tooltip();
        tooltip.label = 'Done';

        icon = iconRow.icon({ key: AssetManagerDialogProps.CancelEdit });
        icon.iconName = 'remove';
        icon.listItemId = asset.id;
        icon.variant = 'danger';
        tooltip = icon.tooltip();
        tooltip.label = 'Cancel';
    }
}