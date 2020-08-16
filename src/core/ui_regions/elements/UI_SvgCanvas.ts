import { UI_ElementType } from './UI_ElementType';
import { UI_SvgGroup } from './svg/UI_SvgGroup';
import { UI_Toolbar } from './toolbar/UI_Toolbar';
import { UI_Factory } from '../UI_Factory';
import { AbstractCanvasPlugin } from '../../plugins/AbstractCanvasPlugin';
import { UI_DropLayer } from './surfaces/canvas/UI_DropLayer';
import { UI_Node } from './views/UI_Node';

export class UI_SvgCanvas extends UI_SvgGroup {
    _toolbar: UI_Toolbar;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.SvgCanvas;
    width: string;
    height: string;

    mouseOver(e: MouseEvent) {
        super.mouseOver(e);
        (this.plugin as AbstractCanvasPlugin).over()
    }

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this);
    }

    dropLayer(config: { controllerId: string, prop: string}): UI_DropLayer {
        return UI_Factory.dropLayer(this, config);
    }

    node(config: { controllerId: string, key: string}): UI_Node {
        return UI_Factory.node(this, config);
    }
}
