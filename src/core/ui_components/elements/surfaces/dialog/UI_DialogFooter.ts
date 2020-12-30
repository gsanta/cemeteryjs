import { UI_Container } from "../../UI_Container";
import { UI_DefaultContainer } from "../../UI_DefaultContainer";
import { UI_ElementType } from "../../UI_ElementType";


export class UI_DialogFooter extends UI_DefaultContainer {
    elementType = UI_ElementType.DialogFooter;

    height: number;
}