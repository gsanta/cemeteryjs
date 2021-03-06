import { Registry } from "../../Registry";
import { UI_Element } from "../elements/UI_Element";

export interface UI_ComponentProps<T extends UI_Element> {
    registry: Registry;
    element: T;
}

export interface UI_ContainerProps<T extends UI_Element> {
    registry: Registry;
    element: T;
    children: JSX.Element[];
}