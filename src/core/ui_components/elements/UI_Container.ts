import { UI_Element } from "./UI_Element";

export abstract class UI_Container extends UI_Element {
    children: UI_Element[] = [];
}