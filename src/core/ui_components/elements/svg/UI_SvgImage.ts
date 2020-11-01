import { UI_ElementType } from '../UI_ElementType';
import { UI_Element } from '../UI_Element';

export class UI_SvgImage extends UI_Element {
    elementType = UI_ElementType.SvgImage;

    transform: string;
    width: number;
    height: number;
    preservAspectRatio: string;
    x: number;
    y: number;
    strokeColor: string;
    href: string;
}