import { UI_FileUpload } from "./UI_FileUpload";
import { UI_Button } from "./UI_Button";
import { UI_Table } from "./UI_Table";
import { UI_ElementType } from "./UI_ElementType";
import { UI_TextField } from "./UI_TextField";
import { UI_Container } from "./UI_Container";

export class UI_Row extends UI_Container {
    type = UI_ElementType.Row;

    table() {
        return new UI_Table(this.controller);
    }

    button(prop: string) {
        const button = new UI_Button(this.controller);
        button.prop = prop;

        this.children.push(button);

        return button;
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

        this.children.push(textField);

        return textField;
    }
}
