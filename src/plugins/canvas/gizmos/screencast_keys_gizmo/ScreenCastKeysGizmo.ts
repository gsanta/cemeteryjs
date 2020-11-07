import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { GizmoPlugin, IGizmoFactory } from "../../../../core/plugin/IGizmo";
import { IRenderer } from "../../../../core/plugin/IRenderer";
import { Registry } from "../../../../core/Registry";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { UI_Row } from "../../../../core/ui_components/elements/UI_Row";

export class ScreenCastKeysGizmoRenderer implements IRenderer {
    private gizmo: GizmoPlugin;

    constructor(gizmo: GizmoPlugin) {
        this.gizmo = gizmo;
    }

    renderInto(row: UI_Row): void {
        const box = row.box({});
        box.width = this.gizmo.width + 'px' || '100px';
        box.height = this.gizmo.height + 'px' || '100px';
 
        if (this.gizmo.getData('lastExecutedKey')) {
            const text = row.text();
            text.css = {
                color: 'black',
                backgroundColor: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '0 5px',
                height: '25px'
            }
            text.text = this.gizmo.getData('lastExecutedKey');
        }    
    }
}

export function onScreenCastGizmoKeyDown(event: IKeyboardEvent, gizmo: GizmoPlugin, plugin: AbstractCanvasPanel, registry: Registry) {
    const ctrl = event.isCtrlDown ? 'Ctrl/Cmd' : undefined;
    const shift = event.isShiftDown ? 'Shift' : undefined;
    const alt =  event.isAltDown ? 'Alt' : undefined;

    let char: string = undefined;
    if (/[a-zA-Z0-9-_ ]/.test(String.fromCharCode(event.keyCode))) {
        char = String.fromCharCode(event.keyCode);
    }
    const str = [ctrl, shift, alt, char].filter(str => str !== undefined).join(' + ');

    gizmo.setData('lastExecutedKey', str);
    registry.services.render.reRender(plugin.region);
    
    if (gizmo.getData('clearTimeoutRef')) {
        clearTimeout(gizmo.getData('clearTimeoutRef'));
        gizmo.deleteData('clearTimeoutRef');
    }

    const clearTimeoutRef = setTimeout(() => {
        gizmo.deleteData('lastExecutedKey');
        registry.services.render.reRender(plugin.region);
    }, 500);
    gizmo.setData('clearTimeoutRef', clearTimeoutRef);
}