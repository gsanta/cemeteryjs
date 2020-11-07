



import { Bab_EngineFacade } from "../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { MeshView } from "../../../core/models/views/MeshView";
import { AbstractCanvasPanel, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas2dPanel } from "../../../core/plugin/Canvas2DPanel";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CommonToolController, SceneEditorToolController, CanvasContextDependentToolController } from "../../../core/plugin/controller/ToolController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { DeleteTool } from "../../../core/plugin/tools/DeleteTool";
import { SelectTool } from "../../../core/plugin/tools/SelectTool";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ThumbnailCreateControl, ThumbnailUploadControl, ClearThumbnailControl } from "./ThumbnailDialogProps";

export const ThumbnailCanvasId = 'thumbnail-canvas';

export function registerThumbnailCanvas(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas3dPanel(registry, this.region, ThumbnailCanvasId, 'Thumbnail canvas');
    
    const propControllers = [
        new ThumbnailCreateControl(),
        new ThumbnailUploadControl(),
        new ClearThumbnailControl()
    ];

    const tools = [
        new CameraTool(this, registry)
    ];

    const engine = new Bab_EngineFacade(this.registry);
    canvas.engine = engine;
    canvas.setController(new FormController(canvas, registry, propControllers));
    canvas.setCamera(engine.getCamera());
    tools.forEach(tool => canvas.addTool(tool));


    canvas.onMounted(() => {
        const meshView = this.registry.stores.views.getOneSelectedView() as MeshView;

        engine.setup(this.panel.htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            this.engine.meshes.createInstance(meshView.getObj())
                .then(() => {
                    this.engine.meshes.setRotation(meshView.getObj(), 0);
                    this.engine.meshes.setPosition(meshView.getObj(), new Point_3(0, 0, 0));
                });
        }, 500);
    });

    canvas.onUnmounted(() => {
        engine.engine.dispose();
    });

    return canvas;
}