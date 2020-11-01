import { UI_Factory } from "../../UI_Factory";
import { UI_Container } from "../UI_Container";
import { UI_ElementType } from "../UI_ElementType";


export class UI_SvgDefs extends UI_Container {
    elementType = UI_ElementType.SvgDef;

    marker(props: {key: string, uniqueId: string}) {
        return UI_Factory.svgMarker(this, props);
    }
}