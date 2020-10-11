import { UI_DefaultContainer } from "./UI_DefaultContainer";
import { UI_ElementType } from "./UI_ElementType";


export class UI_Box extends UI_DefaultContainer {
    elementType = UI_ElementType.Box;

    width: string;
    height: string;
}