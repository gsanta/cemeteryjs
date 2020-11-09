import { UI_ElementType } from "./UI_ElementType";
import { UI_Row } from "./UI_Row";
import { UI_Container } from "./UI_Container";
import { UI_SvgCanvas } from './UI_SvgCanvas';
import { UI_Factory } from '../UI_Factory';
import { UI_HtmlCanvas } from './UI_HtmlCanvas';
import { UI_ElementConfig } from "./UI_Element";
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";

const elementType = UI_ElementType.Layout;

export class UI_Layout extends UI_Container {
    elementType = elementType;

    row(config: UI_ElementConfig): UI_Row {
        return UI_Factory.row(this, config);
    }

    accordion(config: UI_ElementConfig) {
        return UI_Factory.accordion(this, config);
    }

    svgCanvas(config: UI_ElementConfig & { canvasPanel: AbstractCanvasPanel }): UI_SvgCanvas {
        return UI_Factory.svgCanvas(this, config);
    }

    htmlCanvas(config: UI_ElementConfig & { canvasPanel: AbstractCanvasPanel }): UI_HtmlCanvas {
        return UI_Factory.htmlCanvas(this, config);
    }
}