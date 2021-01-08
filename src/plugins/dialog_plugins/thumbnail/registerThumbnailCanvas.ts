



import { Bab_EngineFacade } from "../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { MeshView } from "../../canvas_plugins/scene_editor/models/views/MeshView";
import { AbstractCanvasPanel } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ThumbnailCanvasRenderer } from "./ThumbnailCanvasRenderer";
import { ClearThumbnailControl, ThumbnailCreateControl, ThumbnailUploadControl } from "./ThumbnailDialogProps";

export const ThumbnailCanvasId = 'thumbnail-canvas';

export function registerThumbnailCanvas(registry: Registry) {
    const canvas = createCanvas(registry);

    registry.ui.canvas.registerCanvas(canvas);
}

function createCanvas(registry: Registry): AbstractCanvasPanel {
    const canvas = new Canvas3dPanel(registry, UI_Region.Dialog, ThumbnailCanvasId, 'Thumbnail canvas');
    
    const propControllers = [
        new ThumbnailCreateControl(registry),
        new ThumbnailUploadControl(registry),
        new ClearThumbnailControl(registry)
    ];

    const tools = [
        new CameraTool(canvas, registry)
    ];

    const engine = new Bab_EngineFacade(registry, 'Thumbnail Canvas Engine');
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
                    canvas.engine.meshes.setRotation(meshView.getObj(), new Point_3(0, 0, 0));
                    canvas.engine.meshes.setPosition(meshView.getObj(), new Point_3(0, 0, 0));
                });
        }, 500);
    });

    canvas.onUnmounted(() => {
        engine.engine.dispose();
    });

    return canvas;
}