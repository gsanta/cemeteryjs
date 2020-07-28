import { UI_Container } from './UI_Container';
import { UI_Factory } from '../UI_Factory';
import { UI_Text } from './UI_Text';
import { UI_Button } from './UI_Button';
import { UI_Row } from './UI_Row';
import { UI_ListItem } from './UI_ListItem';

export class UI_DefaultContainer extends UI_Container {
    listItem(config: {controllerId?: string, prop: string}): UI_ListItem {
        return UI_Factory.listItem(this, config);
    }

    row(config: {controllerId?: string}): UI_Row {
        return UI_Factory.row(this, config);
    }

    table(config: {controllerId?: string}) {
        return UI_Factory.table(this, config);
    }

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

    grid(config: {prop: string, filledIndexProp?: string}) {
        return UI_Factory.grid(this, config);
    }

    accordion(config: {controllerId?: string}) {
        return UI_Factory.accordion(this, config);
    }
}