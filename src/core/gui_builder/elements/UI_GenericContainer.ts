import { UI_Factory } from '../UI_Factory';
import { UI_Button } from "./UI_Button";
import { UI_Container } from "./UI_Container";
import { UI_Text } from "./UI_Text";

export class UI_GenericContainer extends UI_Container {
    text(): UI_Text {
        return UI_Factory.text(this);
    }

    button(prop: string): UI_Button {
        return UI_Factory.button(this, {prop});
    }

    select(valProp: string, listProp: string) {
        return UI_Factory.select(this, {valProp, listProp});
    }

    fileUpload(prop: string) {
        return UI_Factory.fileUpload(this, {prop});
    }

    textField(prop?: string) {
        return UI_Factory.textField(this, {prop});
    }

    grid(prop: string, filledIndexProp: string) {
        return UI_Factory.grid(this, {prop, filledIndexProp});
    }
}