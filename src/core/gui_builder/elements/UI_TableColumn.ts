import { UI_GenericContainer } from "./UI_GenericContainer";
import { UI_ElementType } from "./UI_ElementType";

export class UI_TableColumn extends UI_GenericContainer {
    elementType = UI_ElementType.TableColumn;
    width: number;
}