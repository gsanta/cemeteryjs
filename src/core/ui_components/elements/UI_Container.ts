import { PropController } from "../../plugin/controller/FormController";
import { UI_Element } from "./UI_Element";

export abstract class UI_Container<C extends PropController = any> extends UI_Element<C> {
    children: UI_Element[] = [];
}