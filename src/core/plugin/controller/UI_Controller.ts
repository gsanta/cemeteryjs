import { Point } from "../../../utils/geometry/shapes/Point";
import { UI_Element } from "../../ui_components/elements/UI_Element";
import { UI_ListItem } from "../../ui_components/elements/UI_ListItem";

export interface UI_Controller {
    id: string;
    change(val: any, element: UI_Element);
    click(element: UI_Element): void;
    blur(element: UI_Element): void;
    mouseOver(element: UI_Element): void;
    mouseOut(element: UI_Element): void;
    mouseDown(e: MouseEvent, element: UI_Element): void;
    mouseMove(e: MouseEvent, element: UI_Element): void;
    mouseUp(e: MouseEvent, element: UI_Element): void;
    mouseWheel(e: WheelEvent): void;
    dndDrop(point: Point);
    dndStart(element: UI_Element, listItem: string): void;
    dndEnd(uiListItem: UI_ListItem): void;
}