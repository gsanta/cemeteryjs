import { UI_Toolbar } from "./toolbar/UI_Toolbar";
import { UI_ElementType } from "./UI_ElementType";
import { UI_Factory } from '../UI_Factory';
import { UI_Element } from './UI_Element';


export class UI_HtmlCanvas extends UI_Element {
    _toolbar: UI_Toolbar;

    elementType = UI_ElementType.HtmlCanvas;
    width: string;
    height: string;

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this);
    }

    getToolbar(): UI_Toolbar {
        return this._toolbar;
    }
}