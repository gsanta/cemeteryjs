import { UI_ControlledElementConfig, UI_Element } from "../../UI_Element";
import { UI_ElementType } from "../../UI_ElementType";
import { TreeController } from "./TreeController";

export class UI_Tree extends UI_Element<TreeController> {
    elementType = UI_ElementType.Tree;
    
    constructor(config: UI_ControlledElementConfig<TreeController>) {
        super({controller: undefined, key: config.key, paramController: config.controller, parent: config.parent});
    }
}