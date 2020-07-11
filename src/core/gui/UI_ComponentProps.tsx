import { UI_Element } from "../gui_builder/elements/UI_Element";

export interface UI_ComponentProps<T extends UI_Element> {
    element: T;
}