import { UI_InputElement } from "./UI_InputElement";
import { UI_ElementType } from "./UI_ElementType";
import { FormController, MultiSelectController } from "../../controller/FormController";
import { UI_Element } from "./UI_Element";

export class UI_PopupMultiSelect extends UI_InputElement<MultiSelectController> {
    elementType = UI_ElementType.PopupMultiSelect;
    
    constructor(config: {controller: FormController, key?: string, uniqueId?: string, parent?: UI_Element}, popupAnchorParent: UI_Element) {
        super(config);
        this.popupAnchorParent = popupAnchorParent;
    }

    clearable: boolean = false;
    label: string;
    placeholder: string;

    readonly popupAnchorParent: UI_Element;
    popupWidth: string;
    popupHeight: string;
}