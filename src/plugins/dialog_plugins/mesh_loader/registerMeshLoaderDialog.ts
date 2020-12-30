import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { MeshLoaderDialogControllers } from "./MeshLoaderDialogControllers";
import { MeshLoaderDialogRenderer } from "./MeshLoaderDialogRenderer";
import { MeshLoaderPreviewCanvas } from "./MeshLoaderPreviewCanvas";

export const MeshLoaderDialogId = 'mesh-loader-dialog';

export function registerMeshLoaderDialog(registry: Registry) {
    const canvas = new MeshLoaderPreviewCanvas(registry);
    registry.ui.canvas.registerCanvas(canvas.getCanvas());

    const panel = new UI_Panel(registry, UI_Region.Dialog, MeshLoaderDialogId, 'Mesh Loader');

    const controller = new MeshLoaderDialogControllers(registry, canvas)
    panel.renderer = new MeshLoaderDialogRenderer(registry, controller);
    // panel.controller = new FormController(undefined, registry, []);
    registry.ui.panel.registerPanel(panel);


}