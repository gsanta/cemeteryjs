import { UI_Factory } from '../UI_Factory';
import { UI_Container } from "./UI_Container";
import { UI_ElementType } from "./UI_ElementType";

export class UI_Table extends UI_Container {
    elementType = UI_ElementType.Table;
    width: number;
    columnWidths: number[];

    tableRow(config: { isHeader?: boolean }) {
        const row = UI_Factory.tableRow(this, config);
        row._derivedColumnWidths = this.columnWidths;

        return row;
    }

    tableRowGroup(config: {key: string}) {
        return UI_Factory.tableRowGroup(this, config);
    }
}

export class UI_TableRow extends UI_Container {
    elementType = UI_ElementType.TableRow;
    isHeader: boolean = false;

    _derivedColumnWidths: number[];

    tableColumn() {
        const index = this.children.length;
        const column = UI_Factory.tableColumn(this, {});
        column._derivedWidth = this._derivedColumnWidths ? this._derivedColumnWidths[index] : undefined;

        return column;
    }
}

