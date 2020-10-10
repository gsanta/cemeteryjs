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
            gizmo.setData('lastExecutedKey', event.keyCode);
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
        });

        return gizmo;
    }
    
}

function renderer(element: UI_Row, plugin: GizmoPlugin, registry: Registry) {
    const text = element.text();
    text.css = {
        color: 'black',
        backgroundColor: 'white'
    }
    text.text = plugin.getData('lastExecutedKey');
}