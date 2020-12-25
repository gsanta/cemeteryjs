import { PropController } from "../../plugin/controller/FormController";
import { UI_Element } from "./UI_Element";

export abstract class UI_InputElement<C extends PropController = PropController> extends UI_Element<C> {
    listItemId: string;
    layout: 'horizontal' | 'vertical' = 'vertical';
    inputWidth: string;
    isDisabled: boolean = false;
}
