import { Registry } from "../../Registry";
import { UI_Factory } from '../UI_Factory';
import { UI_GizmoLayer } from "./gizmo/UI_GizmoLayer";
import { UI_DropLayer } from "./surfaces/canvases/UI_DropLayer";
import { UI_Toolbar } from "./toolbar/UI_Toolbar";
import { UI_Container } from "./UI_Container";
import { UI_ElementType } from "./UI_ElementType";


export class UI_HtmlCanvas extends UI_Container {
    _toolbar: UI_Toolbar;
    _gizmoLayer: UI_GizmoLayer;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.HtmlCanvas;
    width: string;
    height: string;

    mouseOver(registry: Registry, e: MouseEvent) {
        // super.mouseOver(e);
        this.canvasPanel.over()
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        // super.mouseOut(e);
        // (this.plugin as AbstractCanvasPlugin).out()
    }

    mouseEnter(registry: Registry, e: MouseEvent) {
        this.canvasPanel.over()
    }

    mouseLeave(registry: Registry) {
        this.canvasPanel.out()
    }

    toolbar(): UI_Toolbar {
        return UI_Factory.toolbar(this, {});
    }

    dropLayer(config: { key: string}): UI_DropLayer {
        return UI_Factory.dropLayer(this, config);
    }

    gizmoLayer(config?: { key: string}): UI_GizmoLayer {
        return UI_Factory.gizmoLayer(this, config);
    }
}