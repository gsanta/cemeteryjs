import { UI_Factory } from '../UI_Factory';
import { UI_Container } from './UI_Container';
import { UI_ElementType } from "./UI_ElementType";
import { UI_Text } from "./UI_Text";
import { UI_Button } from './UI_Button';
import { UI_SvgCanvas } from './UI_SvgCanvas';
import { UI_HtmlCanvas } from './UI_HtmlCanvas';
import { UI_Image } from './UI_Image';

export class UI_Row extends UI_Container {
    elementType = UI_ElementType.Row;
    vAlign: 'start' | 'center';
    hAlign: 'space-between' | 'space-around';
    height: string;

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

    svgCanvas(config: {controllerId?: string}): UI_SvgCanvas {
        return UI_Factory.svgCanvas(this, config);
    }

    htmlCanvas(config: {controllerId?: string}): UI_HtmlCanvas {
        return UI_Factory.htmlCanvas(this, config);
    }

    image(config: {key: string}): UI_Image {
        return UI_Factory.image(this, config);
    }
}
