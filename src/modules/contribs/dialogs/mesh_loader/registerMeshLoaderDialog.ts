import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { UI_Panel, UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { MeshLoaderDialogControllers } from "./MeshLoaderDialogControllers";
import { MeshLoaderDialogRenderer } from "./MeshLoaderDialogRenderer";
import { MeshLoaderPreviewCanvas, MeshLoaderPreviewCanvasId } from "./MeshLoaderPreviewCanvas";

export const MeshLoaderDialogId = 'mesh-loader-dialog';

export function registerMeshLoaderDialog(registry: Registry) {
    
    const panel = new UI_Panel(registry, UI_Region.Dialog, MeshLoaderDialogId, 'Mesh Loader');
    
    panel.onOpen(() => {
        registry.ui.canvas.unregisterCanvas(MeshLoaderPreviewCanvasId);
        
        const canvas = new MeshLoaderPreviewCanvas(registry);
        registry.ui.canvas.registerCanvas(canvas.getCanvas());

        const selectedViews = registry.data.shape.scene.getSelectedShapes();
        const meshObj = selectedViews[0].getObj() as MeshObj;

        const controller = new MeshLoaderDialogControllers(registry, canvas, meshObj);
        panel.renderer = new MeshLoaderDialogRenderer(registry, controller);
    });

    // panel.controller = new FormController(undefined, registry, []);
    registry.ui.panel.registerPanel(panel);
}