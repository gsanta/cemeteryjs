import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { UI_Panel, UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { PhysicsImpostorDialogController } from "./PhysicsImpostorDialogController";
import { PhysicsImpostorDialogRenderer } from "./PhysicsImpostorDialogRenderer";

export const PhysicsImpostorDialogDialogId = 'physics-impostor-dialog-dialog';

export function registerPhysicsImpostorDialog(registry: Registry) {
    
    const panel = new UI_Panel(registry, UI_Region.Dialog, PhysicsImpostorDialogDialogId, 'Physics Impostor');
    
    panel.onOpen(() => {
        const selectedViews = registry.data.shape.scene.getSelectedShapes();
        const meshObj = selectedViews[0].getObj() as MeshObj;

        const controller = new PhysicsImpostorDialogController(registry, meshObj);
        panel.renderer = new PhysicsImpostorDialogRenderer(registry, controller);
    });

    registry.services.module.ui.registerPanel(panel);
}