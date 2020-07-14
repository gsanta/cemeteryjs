import { UI_InputElement } from "./UI_InputElement";
import { UI_ElementType } from "./UI_ElementType";


export class UI_GridSelect extends UI_InputElement {
    elementType = UI_ElementType.GridSelect;
    filledIndexProp: string;
    size: number;
    label: string;

    filledIndexes(): number[] {
        return this.filledIndexProp ? this.controller.val(this.filledIndexProp) : [];
    }
}