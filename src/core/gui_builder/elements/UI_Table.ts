import { UI_Container } from "./UI_Container";
import { UI_ElementType } from "./UI_ElementType";
import { UI_TableColumn } from "./UI_TableColumn";

export class UI_Table extends UI_Container {
    elementType = UI_ElementType.Table;
    width: number;

    tableRow(isHeader = false) {
        const row = new UI_TableRow(this.controller);
        row.isHeader = isHeader;

        this.children.push(row);

        return row;
    }
}

export class UI_TableRow extends UI_Container {
    elementType = UI_ElementType.TableRow;
    isHeader: boolean = false;
    tableColumn() {
        const column = new UI_TableColumn(this.controller);

        this.children.push(column);

        return column;
    }
}

