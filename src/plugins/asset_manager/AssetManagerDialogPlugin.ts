import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { UI_Table } from '../../core/gui_builder/elements/UI_Table';
import { AssetType } from '../../core/models/game_objects/AssetModel';

export const AssetManagerDialogPluginId = 'asset-manager-dialog-plugin'; 
export class AssetManagerDialogPlugin extends UI_Plugin {
    id = AssetManagerDialogPluginId;
    region = UI_Region.Dialog;

    // constructor() {

    // }

    renderInto(layout: UI_Layout): UI_Layout {
        const row = layout.row();

        const table = row.table();
        table.width = 500;

        this.renderTableHeader(table);
        this.renderModelRows(table);

        // const column2 = tableRow.tableColumn();

        return layout;
    }

    private renderTableHeader(table: UI_Table) {
        const tableRow = table.tableRow();
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
        let tableRow = table.tableRow();
        tableRow.isHeader = true;

        let header = tableRow.tableColumn();
        let text = header.text();
        text.text = 'Models';

        header = tableRow.tableColumn();
        text = header.text();
        text.text = '';

        header = tableRow.tableColumn();
        text = header.text();
        text.text = '';

        header = tableRow.tableColumn();
        header.width = 100;

        this.registry.stores.assetStore.getByType(AssetType.Model).forEach(assetModel => {
            tableRow = table.tableRow();

            let column = tableRow.tableColumn();
            let text = column.text();
            text.text = assetModel.id;
    
            column = tableRow.tableColumn();
            text = column.text();
            text.text = assetModel.name;
    
            column = tableRow.tableColumn();
            text = column.text();
            text.text = assetModel.path;

            column = tableRow.tableColumn();
            column.width = 100;
        });

        // const modelComponents = assetModels.map(assetModel => {
        //     return (
        //         <AssetRowStyled>
        //             <div>{assetModel.id}</div>
        //             <div>{this.renderName(assetModel) || '-'}</div>
        //             <div>{this.renderPath(assetModel) || '-'}</div>
        //             <IconGroupStyled>
        //                 <EditIconComponent width="20px" height="20px" onClick={() => controller.updateProp(assetModel.id, AssetManagerDialogProps.EditedAsset)}/>
        //                 <CloseIconComponent width="16px" height="16px" color={colors.danger} onClick={() => controller.updateProp(assetModel.id, AssetManagerDialogProps.Delete)}/>
        //             </IconGroupStyled>
        //         </AssetRowStyled>
        //     );
        // });
        // return (
        //     <div>
        //         <AssetRowHeaderStyled>
        //             <div>{headerTitle}</div>
        //             <div></div>
        //             <div></div>
        //         </AssetRowHeaderStyled>
        //         {modelComponents}
        //     </div>
        // )
    }
}