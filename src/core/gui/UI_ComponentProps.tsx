import { UI_Element } from "../ui_regions/elements/UI_Element";

export interface UI_ComponentProps<T extends UI_Element> {
    element: T;
}

export interface UI_ContainerProps<T extends UI_Element> {
    element: T;
    children: JSX.Element[];
}