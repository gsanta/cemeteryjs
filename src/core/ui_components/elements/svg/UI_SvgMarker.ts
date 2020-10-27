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

    generateId(parent: UI_Element): void {
        this.id = `${parent.id}_${this.elementType}-${this.prop}`;
    }

    rect(prop?: string) {
        return UI_Factory.svgRect(this, {prop});
    }

    line(prop?: string) {
        return UI_Factory.svgLine(this, {prop});
    }

    circle(prop?: string) {
        return UI_Factory.svgCircle(this, {prop});
    }

    path(prop?: string) {
        return UI_Factory.svgPath(this, {prop});
    }

    polygon(prop?: string) {
        return UI_Factory.svgPolygon(this, {prop});
    }
}