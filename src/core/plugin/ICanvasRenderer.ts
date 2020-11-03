import { UI_SvgCanvas } from "../ui_components/elements/UI_SvgCanvas";


export interface ICanvasRenderer {
    renderInto(svgCanvas: UI_SvgCanvas): void;
}