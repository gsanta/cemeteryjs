import { UI_Factory } from '../UI_Factory';
import { UI_Container } from "./UI_Container";
import { UI_ElementType } from "./UI_ElementType";

export class UI_Table extends UI_Container {
    elementType = UI_ElementType.Table;
    width: number;

    tableRow(config: { isHeader?: boolean }) {
        return UI_Factory.tableRow(this, config);
    }
}

export class UI_TableRow extends UI_Container {
    elementType = UI_ElementType.TableRow;
    isHeader: boolean = false;
    tableColumn() {
        return UI_Factory.tableColumn(this);
    }
}

