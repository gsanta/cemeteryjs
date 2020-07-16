import { UI_Button } from "./UI_Button";
import { UI_Container } from "./UI_Container";
import { UI_FileUpload } from "./UI_FileUpload";
import { UI_GridSelect } from "./UI_GridSelect";
import { UI_Select } from "./UI_Select";
import { UI_Text } from "./UI_Text";
import { UI_TextField } from "./UI_TextField";

export class UI_GenericContainer extends UI_Container {
    text(prop?: string): UI_Text {
        const text = new UI_Text(this.controller);
        text.prop = prop;

        this.children.push(text);

        return text;
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