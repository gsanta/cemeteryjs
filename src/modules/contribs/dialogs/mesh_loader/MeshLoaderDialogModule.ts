import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { UI_Panel, UI_Region } from "../../../../core/models/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { MeshLoaderDialogControllers } from "./MeshLoaderDialogControllers";
import { MeshLoaderDialogRenderer } from "./MeshLoaderDialogRenderer";
import { MeshLoaderPreviewCanvas, MeshLoaderPreviewCanvasId } from "./MeshLoaderPreviewCanvas";

export const MeshLoaderDialogId = 'mesh-loader-dialog';

export class MeshLoaderDialogModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Dialog, MeshLoaderDialogId, 'Mesh Loader');
        
        this.onOpen(() => {
            registry.services.module.ui.unregisterCanvas(MeshLoaderPreviewCanvasId);
            
            const canvas = new MeshLoaderPreviewCanvas(registry);
            registry.services.module.ui.registerCanvas(canvas.getCanvas());
    
            const meshObj = registry.data.scene.items.getByTag('select')[0] as MeshObj;
    
            const controller = new MeshLoaderDialogControllers(registry, canvas, meshObj);
            this.renderer = new MeshLoaderDialogRenderer(registry, controller);
        });
    }
}