



import { FormController } from "../../../../../core/controller/FormController";
import { Bab_EngineFacade } from "../../../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { IObj } from "../../../../../core/models/objs/IObj";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { CameraTool } from "../../../../../core/controller/tools/CameraTool";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AbstractModuleExporter } from "../../../../../core/services/export/AbstractModuleExporter";
import { AbstractModuleImporter } from "../../../../../core/services/import/AbstractModuleImporter";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MeshShape } from "../../../main/models/shapes/MeshShape";
import { ThumbnailCanvasRenderer } from "./ThumbnailCanvasRenderer";
import { ClearThumbnailControl, ThumbnailCreateControl, ThumbnailUploadControl } from "./ThumbnailDialogProps";

export const ThumbnailCanvasId = 'thumbnail-canvas';

export class ThumbnailCanvasModule extends Canvas3dPanel {

    exporter: AbstractModuleExporter;
    importer: AbstractModuleImporter;
    data = undefined;

    constructor(registry: Registry) {
        super(registry, UI_Region.Dialog, ThumbnailCanvasId, 'Thumbnail canvas');

        const propControllers = [
            new ThumbnailCreateControl(registry),
            new ThumbnailUploadControl(registry),
            new ClearThumbnailControl(registry)
        ];
    
        const tools = [
            new CameraTool(this, registry)
        ];
    
        const engine = new Bab_EngineFacade(registry, 'Thumbnail this Engine');
        this.engine = engine;
        this.setController(new FormController(this, registry, propControllers));
        this.setCamera(engine.getCamera());
        this.renderer = new ThumbnailCanvasRenderer(registry);
        tools.forEach(tool => this.addTool(tool));
    
    
        this.onMounted(() => {
            const meshView = registry.data.sketch.selection.getAllItems()[0] as MeshShape;
    
            engine.setup(this.htmlElement.getElementsByTagName('canvas')[0]);
    
            setTimeout(() => {
                this.engine.meshes.createInstance(meshView.getObj())
                    .then(() => {
                        this.engine.meshes.setRotation(meshView.getObj(), new Point_3(0, 0, 0));
                        this.engine.meshes.setPosition(meshView.getObj(), new Point_3(0, 0, 0));
                    });
            }, 500);
        });
    
        this.onUnmounted(() => {
            engine.engine.dispose();
        });
    
    }
}