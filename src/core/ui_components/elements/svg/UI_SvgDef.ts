import { UI_Factory } from "../../UI_Factory";
import { UI_Container } from "../UI_Container";
import { UI_Element, UI_ElementConfig } from "../UI_Element";
import { UI_ElementType } from "../UI_ElementType";


export class UI_SvgDef extends UI_Container {
    elementType = UI_ElementType.SvgDef;

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    marker(config: UI_ElementConfig) {
        return UI_Factory.svgMarker(this, config);
    }
}