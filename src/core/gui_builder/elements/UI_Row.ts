import { UI_ElementType } from "./UI_ElementType";
import { UI_GenericContainer } from "./UI_GenericContainer";
import { UI_Table } from "./UI_Table";
import { UI_Factory } from '../UI_Factory';

export class UI_Row extends UI_GenericContainer {
    elementType = UI_ElementType.Row;
    align: 'left' | 'center';

    table(config: {controllerId?: string}) {
        return UI_Factory.table(this, config);
    }
}
