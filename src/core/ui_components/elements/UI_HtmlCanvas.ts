import { UI_Toolbar } from "./toolbar/UI_Toolbar";
import { UI_ElementType } from "./UI_ElementType";
import { UI_Factory } from '../UI_Factory';
import { UI_Element } from './UI_Element';
import { UI_DropLayer } from "./surfaces/canvases/UI_DropLayer";
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";
import { Registry } from "../../Registry";
import { UI_GizmoLayer } from "./gizmo/UI_GizmoLayer";


export class UI_HtmlCanvas extends UI_Element {
    _toolbar: UI_Toolbar;
    _gizmoLayer: UI_GizmoLayer;
    _dropLayer: UI_DropLayer;

    elementType = UI_ElementType.HtmlCanvas;
    width: string;
    height: string;

    mouseOver(registry: Registry, e: MouseEvent) {
        // super.mouseOver(e);
        (registry.plugins.getPanelById(this.pluginId) as AbstractCanvasPanel).over()
    }

    mouseOut(registry: Registry, e: MouseEvent) {
        // super.mouseOut(e);
        // (this.plugin as AbstractCanvasPlugin).out()
    }

    mouseEnter(registry: Registry, e: MouseEvent) {
        (registry.plugins.getPanelById(this.pluginId) as AbstractCanvasPanel).over()
    }

    mouseLeave(registry: Registry) {
        (registry.plugins.getPanelById(this.pluginId) as AbstractCanvasPanel).out()
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