import { UI_ElementType } from "./UI_ElementType";
import { UI_GenericContainer } from "./UI_GenericContainer";
import { UI_Table } from "./UI_Table";

export class UI_Row extends UI_GenericContainer {
    elementType = UI_ElementType.Row;
    align: 'left' | 'center';

    table() {
        return new UI_Table(this.controller);
    }
}
