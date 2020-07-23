import { UI_ElementType } from './UI_ElementType';
import { UI_SvgGroup } from './svg/UI_SvgGroup';
import { UI_Toolbar } from './toolbar/UI_Toolbar';

export class UI_SvgCanvas extends UI_SvgGroup {
    private _toolbar: UI_Toolbar;

    elementType = UI_ElementType.SvgCanvas;


    toolbar(): UI_Toolbar {
        const toolbar = new UI_Toolbar(this.controller);
        this._toolbar = toolbar;
        return toolbar;
    }

    getToolbar(): UI_Toolbar {
        return this._toolbar;
    }
}
