import { UI_ElementType } from "./UI_ElementType";
import { UI_Container } from "./UI_Container";

export class UI_Table extends UI_Container {
    type = UI_ElementType.Table;

    tableRow(isHeader = false) {
        const row = new UI_TableRow(this.controller);
        row.isHeader = isHeader;

        return row;
    }
}

export class UI_TableRow extends UI_Container {
    type = UI_ElementType.TableRow;
    isHeader: boolean = false;
    tableColumn() {
        return new UI_TableColumn(this.controller);
    }
}

export class UI_TableColumn extends UI_Container {
    type = UI_ElementType.TableColumn;
    isHeader: boolean = false;
}