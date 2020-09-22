import { UI_ElementType } from './UI_ElementType';
import { UI_SvgGroup } from './svg/UI_SvgGroup';
import { UI_Toolbar } from './toolbar/UI_Toolbar';
import { UI_Factory } from '../UI_Factory';
import { AbstractCanvasPlugin } from '../../plugin/AbstractCanvasPlugin';
import { UI_DropLayer } from './surfaces/canvases/UI_DropLayer';

export class UI_SvgCanvas extends UI_SvgGroup {
    _toolbar: UI_Toolbar;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.SvgCanvas;
    width: string;
    height: string;

    mouseOver(e: MouseEvent) {
        // super.mouseOver(e);
        (this.plugin as AbstractCanvasPlugin).over()
    }

    mouseOut(e: MouseEvent) {
        // super.mouseOut(e);
        // (this.plugin as AbstractCanvasPlugin).out()
    }

    mouseEnter(e: MouseEvent) {
        (this.plugin as AbstractCanvasPlugin).over()
    }

    mouseLeave(e: MouseEvent) {
        (this.plugin as AbstractCanvasPlugin).out()
    }

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this);
    }

    dropLayer(config: { controllerId: string, prop: string}): UI_DropLayer {
        return UI_Factory.dropLayer(this, config);
    }
}
