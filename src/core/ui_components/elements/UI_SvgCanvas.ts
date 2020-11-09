import { UI_ElementType } from './UI_ElementType';
import { UI_SvgGroup } from './svg/UI_SvgGroup';
import { UI_Toolbar } from './toolbar/UI_Toolbar';
import { UI_Factory } from '../UI_Factory';
import { AbstractCanvasPanel } from '../../plugin/AbstractCanvasPanel';
import { UI_DropLayer } from './surfaces/canvases/UI_DropLayer';
import { Registry } from '../../Registry';
import { UI_GizmoLayer } from './gizmo/UI_GizmoLayer';
import { FormController } from '../../plugin/controller/FormController';
import { UI_ElementConfig } from './UI_Element';

export class UI_SvgCanvas extends UI_SvgGroup {
    _toolbar: UI_Toolbar;
    _gizmoLayer: UI_GizmoLayer;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.SvgCanvas;
    width: string;
    height: string;

    constructor(config: {controller: FormController, canvasPanel: AbstractCanvasPanel, key?: string, target?: string, uniqueId?: string}) {
        super(config);

        this.canvasPanel = this.canvasPanel;
    }
    mouseOver(registry: Registry, e: MouseEvent) {
        // super.mouseOver(e);
        this.canvasPanel.over();
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        // super.mouseOut(e);
        // (this.plugin as AbstractCanvasPlugin).out()
    }

    mouseEnter(registry: Registry, e: MouseEvent) {
        this.canvasPanel.over();
    }

    mouseLeave(registry: Registry, e: MouseEvent) {
        this.canvasPanel.out();
    }

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this, {});
    }

    dropLayer(config: UI_ElementConfig): UI_DropLayer {
        return UI_Factory.dropLayer(this, config);
    }

    gizmoLayer(config?: { key: string}): UI_GizmoLayer {
        return UI_Factory.gizmoLayer(this, config);
    }
}
