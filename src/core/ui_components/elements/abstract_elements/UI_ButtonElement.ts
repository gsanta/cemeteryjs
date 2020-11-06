import { UI_Element } from "../UI_Element";
import { Registry } from "../../../Registry";

export abstract class UI_ButtonElement extends UI_Element {
    click(registry: Registry): void {
        this.controller && this.controller.click(this);
    }
}
