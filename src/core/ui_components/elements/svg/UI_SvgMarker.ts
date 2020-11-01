import { UI_Factory } from "../../UI_Factory";
import { UI_Element } from "../UI_Element";
import { UI_ElementType } from "../UI_ElementType";
import { UI_SvgGroup } from "./UI_SvgGroup";


export class UI_SvgMarker extends UI_SvgGroup {
    elementType = UI_ElementType.SvgMarker;
    viewBox: string;
    refX: number;
    refY: number;
    markerWidth: number;
    markerHeight: number;
    orient: string = 'auto-start-reverse';

    rect(key?: string) {
        return UI_Factory.svgRect(this, {key});
    }

    line(key?: string) {
        return UI_Factory.svgLine(this, {key});
    }

    circle(key?: string) {
        return UI_Factory.svgCircle(this, {key});
    }

    path(key?: string) {
        return UI_Factory.svgPath(this, {key});
    }

    polygon(key?: string) {
        return UI_Factory.svgPolygon(this, {key});
    }
}