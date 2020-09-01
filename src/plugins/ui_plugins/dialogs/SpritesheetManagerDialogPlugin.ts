import { UI_Plugin, UI_Region } from "../../../core/plugins/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { UI_Dialog } from "../../../core/ui_components/elements/surfaces/UI_Dialog";
import { UI_Table } from "../../../core/ui_components/elements/UI_Table";
import { SpritesheetManagerDialogController, SpritesheetManagerDialogProps } from "./SpritesheetManagerDialogController";
import { AssetType } from "../../../core/models/game_objects/AssetObj";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";

export const SpriteSheetManagerDialogPluginId = 'sprite-sheet-manager-dialog-plugin'; 
export class SpriteSheetManagerDialogPlugin extends UI_Plugin {
    id = SpriteSheetManagerDialogPluginId;
    region = UI_Region.Dialog;
    displayName = 'Spritesheet manager';

    private controller: SpritesheetManagerDialogController;

    constructor(registry: Registry) {
        super(registry);

        this.controller = new SpritesheetManagerDialogController(this, registry);
    }

    protected renderInto(layout: UI_Dialog): UI_Layout {
        layout.controller = this.controller;
        layout.width = '530px';

        const row = layout.row({ key: '1' });
        
        const table = row.table(null);
        table.columnWidths = [150, 150, 150, 54];
        table.width = 500;

        this.renderTableHeader(table);
        this.renderTableRows(table);

        this.renderAddNewButton(layout);

        return layout;
    }

    private renderTableHeader(table: UI_Table) {
        const tableRow = table.tableRow({isHeader: true});
        tableRow.isHeader = true;
        
        let header = tableRow.tableColumn(null);
        let text = header.text();
        text.text = 'Name';

        header = tableRow.tableColumn(null);
        text = header.text();
        text.text = 'Path';

        header = tableRow.tableColumn(null);
        text = header.text();
        text.text = 'Json path';

        header = tableRow.tableColumn(null);
        header.width = 100;
    }

    private renderTableRows(table: UI_Table) {
        this.registry.stores.spriteSheetObjStore.getAll().forEach(spriteSheet => {
            const jsonAsset = this.registry.stores.assetStore.getAssetById(spriteSheet.jsonAssetId);
            const spriteSheetAsset = this.registry.stores.assetStore.getAssetById(spriteSheet.spriteAssetId);

            const tableRow = table.tableRow({isHeader: false});
            tableRow.isHeader = false;
            
            let column = tableRow.tableColumn(null);
            let text = column.text();
            text.text = '-';
    
            column = tableRow.tableColumn(null);
            text = column.text();
            text.text = spriteSheetAsset.path;

            column = tableRow.tableColumn(null);
            text = column.text();
            text.text = jsonAsset.path;    
    
            column = tableRow.tableColumn(null);
            column.width = 100;
        });
    }
    
    private renderAddNewButton(layout: UI_Dialog) {
        const row = layout.row({ key: '1' });
        row.margin = '10px 0px';

        row.hAlign = 'space-around';

        let fileUploadButton = row.fileUpload(SpritesheetManagerDialogProps.UploadSpritesheetImg);
        fileUploadButton.label = this.controller.tmpImgAsset ? this.controller.tmpImgAsset.path : 'Upload spritesheet';

        fileUploadButton = row.fileUpload(SpritesheetManagerDialogProps.UploadSpritesheetJson);
        fileUploadButton.label = 'Upload json';

        const addButton = row.button(SpritesheetManagerDialogProps.AddSpriteSheet);
        addButton.label = 'Add';
    }
}