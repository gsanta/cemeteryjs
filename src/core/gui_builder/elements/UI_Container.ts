import { UI_Element } from "./UI_Element";
import { UI_Row } from "./UI_Row";

export abstract class UI_Container extends UI_Element {
    children: UI_Element[] = [];
}