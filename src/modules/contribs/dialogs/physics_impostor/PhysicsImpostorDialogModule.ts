import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { UI_Panel, UI_Region } from "../../../../core/models/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { PhysicsImpostorDialogController } from "./PhysicsImpostorDialogController";
import { PhysicsImpostorDialogRenderer } from "./PhysicsImpostorDialogRenderer";

export const PhysicsImpostorDialogDialogId = 'physics-impostor-dialog-dialog';

export class PhysicsImpostorDialogModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Dialog, PhysicsImpostorDialogDialogId, 'Physics Impostor');
        
        this.onOpen(() => {
            const meshObj = registry.data.scene.items.getByTag('select')[0]as MeshObj;
    
            const controller = new PhysicsImpostorDialogController(registry, meshObj);
            this.renderer = new PhysicsImpostorDialogRenderer(registry, controller);
        });
    }
}