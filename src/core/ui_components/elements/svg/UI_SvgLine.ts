import { UI_ElementType } from '../UI_ElementType';
import { UI_Factory } from '../../UI_Factory';
import { UI_Container } from '../UI_Container';

export class UI_SvgLine extends UI_Container {
    elementType = UI_ElementType.SvgLine;
    markerEnd: string;
    transform: string;
    width: number;
    stroke: string = 'black';
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    marker(props: {key: string, uniqueId: string}) {
        return UI_Factory.svgMarker(this, props);
    }
}