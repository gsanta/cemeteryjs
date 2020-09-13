import { UI_Container } from './UI_Container';
import { UI_Factory } from '../UI_Factory';
import { UI_Text } from './UI_Text';
import { UI_Button } from './UI_Button';
import { UI_Row } from './UI_Row';
import { UI_ListItem } from './UI_ListItem';
import { UI_Box } from './UI_Box';
import { UI_Column } from './UI_Column';
import { UI_HtmlCanvas } from './UI_HtmlCanvas';
import { UI_Image } from './UI_Image';
import { UI_Icon } from './UI_Icon';
import { AbstractController } from '../../plugins/controllers/AbstractController';
import { AbstractCanvasPlugin } from '../../plugins/AbstractCanvasPlugin';

export class UI_DefaultContainer extends UI_Container {
    listItem(config: {controller?: AbstractController, prop: string, dropTargetPlugin: AbstractCanvasPlugin, dropId: string}): UI_ListItem {
        return UI_Factory.listItem(this, config);
    }

    row(config: {controllerId?: string, key: string}): UI_Row {
        return UI_Factory.row(this, config);
    }

    column(config: {controllerId?: string, key: string}): UI_Column {
        return UI_Factory.column(this, config);
    }

    box(config: {controllerId?: string, key: string}): UI_Box {
        return UI_Factory.box(this, config);
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

    select(config: {prop: string, target?: string}) {
        return UI_Factory.select(this, config);
    }

    fileUpload(prop: string) {
        return UI_Factory.fileUpload(this, {prop});
    }

    textField(config: {prop: string, target?: string}) {
        return UI_Factory.textField(this, config);
    }

    grid(config: {prop: string, filledIndexProp?: string}) {
        return UI_Factory.grid(this, config);
    }

    accordion(config: {controllerId?: string}) {
        return UI_Factory.accordion(this, config);
    }

    htmlCanvas(config: {controllerId?: string}): UI_HtmlCanvas {
        return UI_Factory.htmlCanvas(this, config);
    }

    image(config: {key: string}): UI_Image {
        return UI_Factory.image(this, config);
    }

    icon(config: {prop: string}): UI_Icon {
        return UI_Factory.icon(this, config);
    }
}