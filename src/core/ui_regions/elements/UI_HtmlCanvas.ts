import { UI_Toolbar } from "./toolbar/UI_Toolbar";
import { UI_ElementType } from "./UI_ElementType";
import { UI_Factory } from '../UI_Factory';
import { UI_Element } from './UI_Element';
import { UI_DropLayer } from "./surfaces/canvas/UI_DropLayer";


export class UI_HtmlCanvas extends UI_Element {
    _toolbar: UI_Toolbar;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.HtmlCanvas;
    width: string;
    height: string;

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this);
    }

    dropLayer(config: { controllerId?: string, prop: string}): UI_DropLayer {
        return UI_Factory.dropLayer(this, config);
    }
}