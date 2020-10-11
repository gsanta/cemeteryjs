import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { GizmoPlugin, IGizmoFactory } from "../../../../core/plugin/IGizmo";
import { Registry } from "../../../../core/Registry";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { UI_Row } from "../../../../core/ui_components/elements/UI_Row";

export const ScreenCastKeysGizmoFactory: IGizmoFactory = {
    
    newInstance(plugin: AbstractCanvasPlugin, registry: Registry) {
        const gizmo = new GizmoPlugin(registry);
        gizmo.setRenderer(renderer);

        plugin.keyboard.onKeyDown((event: IKeyboardEvent) => {
            onKeyDown(event, gizmo, plugin, registry);

        });

        return gizmo;
    }
}

function onKeyDown(event: IKeyboardEvent, gizmo: GizmoPlugin, plugin: AbstractCanvasPlugin, registry: Registry) {
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

function renderer(element: UI_Row, plugin: GizmoPlugin, registry: Registry) {
    if (!plugin.getData('lastExecutedKey')) {
        return;
    }

    const text = element.text();
    text.css = {
        color: 'black',
        backgroundColor: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '0 5px',
        height: '25px'
    }
    text.text = plugin.getData('lastExecutedKey');
}