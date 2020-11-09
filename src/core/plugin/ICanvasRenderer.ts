import { UI_HtmlCanvas } from "../ui_components/elements/UI_HtmlCanvas";
import { UI_SvgCanvas } from "../ui_components/elements/UI_SvgCanvas";


export interface ICanvasRenderer {
    renderInto(svgCanvas: UI_SvgCanvas | UI_HtmlCanvas): void;
}