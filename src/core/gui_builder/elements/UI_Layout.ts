import { UI_ElementType } from "./UI_ElementType";
import { UI_Row } from "./UI_Row";
import { UI_Container } from "./UI_Container";
import { UI_SvgCanvas } from './UI_SvgCanvas';

export class UI_Layout extends UI_Container {
    elementType = UI_ElementType.Layout;

    row(): UI_Row {
        const row = new UI_Row(this.controller);
        this.children.push(row);

        return row;
    }

    svgCanvas(): UI_SvgCanvas {
        const svgCanvas = new UI_SvgCanvas(this.controller);
        this.children.push(svgCanvas);

        return svgCanvas;
    }
}