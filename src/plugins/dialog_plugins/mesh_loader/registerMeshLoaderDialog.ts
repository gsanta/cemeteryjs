import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { MeshLoaderDialogRenderer } from "./MeshLoaderDialogRenderer";

export const MeshLoaderDialogId = 'mesh-loader-dialog';

export function registerMeshLoaderDialog(registry: Registry) {
    const panel = createDialog(registry);

    registry.ui.panel.registerPanel(panel);
}

function createDialog(registry: Registry): UI_Panel {
    
    const panel = new UI_Panel(registry, UI_Region.Dialog, MeshLoaderDialogId, 'Mesh Loader');
    panel.controller = new FormController(undefined, registry, []);
    panel.renderer = new MeshLoaderDialogRenderer(registry);

    return panel;
}