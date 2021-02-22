import { SpriteSheetObj, SpriteSheetObjType } from "../../../../core/models/objs/SpriteSheetObj";
import { IRenderer } from "../../../../core/models/IRenderer";
import { Registry } from "../../../../core/Registry";
import { UI_Dialog } from "../../../../core/ui_components/elements/surfaces/dialog/UI_Dialog";
import { UI_Table } from "../../../../core/ui_components/elements/UI_Table";
import { SpritesheetManagerDialogProps } from "./SpritesheetManagerDialogProps";


export class SpriteSheetManagerDialogRenderer implements IRenderer<UI_Dialog> {
    private registry: Registry;

    // TODO find a better place to store temporary data
    tempSpriteSheetJson: string;
    tempImagePath: string;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(layout: UI_Dialog): void {
        layout.width = '530px';

        const row = layout.row({ key: '1' });
        
        const table = row.table();
        table.columnWidths = [150, 150, 150, 54];
        table.width = 500;

        this.renderTableHeader(table);
        this.renderTableRows(table);

        this.renderAddNewButton(layout);
    }

    private renderTableHeader(table: UI_Table) {
        const tableRow = table.tableRow({isHeader: true});
        tableRow.isHeader = true;
        
        let header = tableRow.tableColumn();
        let text = header.text();
        text.text = 'Name';

        header = tableRow.tableColumn();
        text = header.text();
        text.text = 'Path';

        header = tableRow.tableColumn();
        text = header.text();
        text.text = 'Json path';

        header = tableRow.tableColumn();
        header.width = 100;
    }

    private renderTableRows(table: UI_Table) {
        this.registry.data.scene.items.getByType(SpriteSheetObjType).forEach((spriteSheet: SpriteSheetObj) => {
            const jsonAsset = this.registry.stores.assetStore.getAssetById(spriteSheet.jsonAssetId);
            const spriteSheetAsset = this.registry.stores.assetStore.getAssetById(spriteSheet.spriteAssetId);

            const tableRow = table.tableRow({isHeader: false});
            tableRow.isHeader = false;
            
            let column = tableRow.tableColumn();
            let text = column.text();
            text.text = '-';
    
            column = tableRow.tableColumn();
            text = column.text();
            text.text = spriteSheetAsset.path;

            column = tableRow.tableColumn();
            text = column.text();
            text.text = jsonAsset.path;    
    
            column = tableRow.tableColumn();
            column.width = 100;
        });
    }
    
    private renderAddNewButton(layout: UI_Dialog) {
        const row = layout.row({ key: '1' });
        row.separator = 'top';
        row.margin = '10px 0px';

        row.hAlign = 'space-around';

        let textField = row.textField({key: SpritesheetManagerDialogProps.SpriteSheetImg});
        textField.label = 'Sprite sheet img';
        // fileUploadButton.width = '170px';

        
        let fileUploadButton = row.fileUpload(SpritesheetManagerDialogProps.SpriteSheetJson);
        
        fileUploadButton.label = this.tempSpriteSheetJson ? this.tempSpriteSheetJson : 'Upload json';
        fileUploadButton.width = '170px';
        // textField.width = '170px';

        const addButton = row.button(SpritesheetManagerDialogProps.AddSpriteSheet);
        addButton.label = 'Add';
    }
}