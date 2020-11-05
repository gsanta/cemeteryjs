import { View } from "../models/views/View"
import { UI_Element } from "../ui_components/elements/UI_Element"
import { UI_SvgCanvas } from "../ui_components/elements/UI_SvgCanvas"
import { FormController } from "./controller/FormController"

export interface ViewPlugin {
    id: string

    createView(): View;
    getController(element: UI_Element): FormController;
    renderInto(canvas: UI_SvgCanvas, view: View): void;
}