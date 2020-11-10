



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
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { cameraInitializer } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ThumbnailCanvasRenderer } from "./ThumbnailCanvasRenderer";
import { ThumbnailCreateControl, ThumbnailUploadControl, ClearThumbnailControl } from "./ThumbnailDialogProps";

export const ThumbnailCanvasId = 'thumbnail-canvas';

export function registerThumbnailCanvas(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas3dPanel(registry, UI_Region.Dialog, ThumbnailCanvasId, 'Thumbnail canvas');
    
    const propControllers = [
        new ThumbnailCreateControl(),
        new ThumbnailUploadControl(),
        new ClearThumbnailControl()
    ];

    const tools = [
        new CameraTool(canvas, registry)
    ];

    const engine = new Bab_EngineFacade(registry);
    canvas.engine = engine;
    canvas.setController(new FormController(canvas, registry, propControllers));
    canvas.setCamera(engine.getCamera());
    canvas.renderer = new ThumbnailCanvasRenderer(registry);
    tools.forEach(tool => canvas.addTool(tool));


    canvas.onMounted(() => {
        const meshView = registry.data.view.scene.getOneSelectedView() as MeshView;

        engine.setup(canvas.htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            canvas.engine.meshes.createInstance(meshView.getObj())
                .then(() => {
                    canvas.engine.meshes.setRotation(meshView.getObj(), 0);
                    canvas.engine.meshes.setPosition(meshView.getObj(), new Point_3(0, 0, 0));
                });
        }, 500);
    });

    canvas.onUnmounted(() => {
        engine.engine.dispose();
    });

    return canvas;
}