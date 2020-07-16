import { UI_FileUpload } from "./UI_FileUpload";
import { UI_Button } from "./UI_Button";
import { UI_Table } from "./UI_Table";
import { UI_ElementType } from "./UI_ElementType";
import { UI_TextField } from "./UI_TextField";
import { UI_Container } from "./UI_Container";
import { UI_Select } from "./UI_Select";
import { UI_GridSelect } from "./UI_GridSelect";

export class UI_Row extends UI_Container {
    elementType = UI_ElementType.Row;
    align: 'left' | 'center';

    table() {
        return new UI_Table(this.controller);
    }

    button(prop: string): UI_Button {
        const button = new UI_Button(this.controller);
        button.prop = prop;

        this.children.push(button);

        return button;
    }

    select(valProp: string, listProp: string) {
        const select = new UI_Select(this.controller);
        select.prop = valProp;
        select.listProp = listProp;

        this.children.push(select);

        return select;
    }

    fileUpload(prop: string) {
        const button = new UI_FileUpload(this.controller);
        button.prop = prop;

        this.children.push(button);

        return button;
    }


    textField(prop?: string) {
        const textField = new UI_TextField(this.controller);
        textField.prop = prop;
        textField.type = 'text';

        this.children.push(textField);

        return textField;
    }

    grid(prop?: string, filledIndexProp?: string) {
        const gridSelect = new UI_GridSelect(this.controller);
        gridSelect.prop = prop;
        gridSelect.filledIndexProp = filledIndexProp;

        this.children.push(gridSelect);

        return gridSelect;
    }
}
