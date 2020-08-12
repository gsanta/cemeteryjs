import { UI_Plugin, UI_Region } from '../../core/plugins/UI_Plugin';
import { UI_Layout } from '../../core/ui_regions/elements/UI_Layout';
import { UI_Table } from '../../core/ui_regions/elements/UI_Table';
import { AssetType } from '../../core/stores/game_objects/AssetModel';
import { Registry } from '../../core/Registry';
import { AssetManagerSidepanelPluginId } from './AssetManagerSidepanelPlugin';
import { AssetManagerDialogControllerId, AssetManagerDialogController } from './AssetManagerDialogController';

export const AssetManagerDialogPluginId = 'asset-manager-dialog-plugin'; 
export class AssetManagerDialogPlugin extends UI_Plugin {
    id = AssetManagerDialogPluginId;
    region = UI_Region.Dialog;
    displayName = 'Asset manager';


    constructor(registry: Registry) {
        super(registry);

        
        this.controllers.set(AssetManagerDialogControllerId, new AssetManagerDialogController(this, registry));
    }


    renderInto(layout: UI_Layout): UI_Layout {
        layout.controllerId = AssetManagerDialogControllerId;
        // layout.controllerId = AssetManagere;

        const row = layout.row({ key: '1' });

        const table = row.table(null);
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
        let tableRow = table.tableRow({isHeader: true});

        let header = tableRow.tableColumn(null);
        let text = header.text();
        text.text = 'Models';

        header = tableRow.tableColumn(null);
        text = header.text();
        text.text = '';

        header = tableRow.tableColumn(null);
        text = header.text();
        text.text = '';

        header = tableRow.tableColumn(null);
        header.width = 100;

        this.registry.stores.assetStore.getByType(AssetType.Model).forEach(assetModel => {
            tableRow = table.tableRow({isHeader: true});

            let column = tableRow.tableColumn(null);
            let text = column.text();
            text.text = assetModel.id;
    
            column = tableRow.tableColumn(null);
            text = column.text();
            text.text = assetModel.name;
    
            column = tableRow.tableColumn(null);
            text = column.text();
            text.text = assetModel.path;

            column = tableRow.tableColumn(null);
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