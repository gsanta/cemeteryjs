import { Bab_EngineFacade } from "../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { IEngineFacade } from "../../../core/engine/IEngineFacade";
import { AssetObj } from "../../../core/models/objs/AssetObj";
import { MeshObj } from "../../../core/models/objs/MeshObj";
import { AbstractCanvasPanel } from "../../../core/plugin/AbstractCanvasPanel";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { FormController } from "../../../core/plugin/controller/FormController";
import { IRenderer } from "../../../core/plugin/IRenderer";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { UI_HtmlCanvas } from "../../../core/ui_components/elements/UI_HtmlCanvas";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";

export const MeshLoaderPreviewCanvasId = 'mesh-loader-preview-canvas';

export class MeshLoaderPreviewCanvas {
    private registry: Registry;
    private canvas: AbstractCanvasPanel;
    private engine: IEngineFacade;

    constructor(registry: Registry) {
        this.registry = registry;
        this.engine = new Bab_EngineFacade(registry);

        this.canvas = createCanvas(registry, this.engine, () => this.setMesh());
    }

    async setMesh() {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();
        const meshObj = selectedViews[0].getObj() as MeshObj;
        // const selectedViews = registry.data.view.scene.getSelectedViews();
        // const meshObj = selectedViews[0].getObj() as MeshObj;
        const assetObj = this.registry.stores.assetStore.getAssetById(meshObj.modelId);
        await this.engine.meshLoader.load(assetObj);
        this.engine.meshes.createInstance(meshObj)
        this.engine.meshes.setRotation(meshObj, new Point_3(0, 0, 0));
        this.engine.meshes.setPosition(meshObj, new Point_3(0, 0, 0));
    }

    getCanvas(): AbstractCanvasPanel {
        return this.canvas;
    }

    getEngine(): IEngineFacade {
        return this.engine;
    }
}

function createCanvas(registry: Registry, engine: IEngineFacade, onMounted: () => void): AbstractCanvasPanel {
    const canvas = new Canvas3dPanel(registry, UI_Region.Dialog, MeshLoaderPreviewCanvasId, 'Preview canvas');

    const tools = [
        new CameraTool(canvas, registry)
    ];

    canvas.engine = engine;
    canvas.setController(new FormController(canvas, registry, []));
    canvas.setCamera(engine.getCamera());
    canvas.renderer = new MeshLoaderCanvasRenderer(registry);
    tools.forEach(tool => canvas.addTool(tool));


    canvas.onMounted(() => {
        engine.setup(canvas.htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            onMounted();
        }, 500);
    });

    canvas.onUnmounted(() => {
        // engine.engine.dispose();
    });

    return canvas;
}

class MeshLoaderCanvasRenderer implements IRenderer {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(canvas: UI_HtmlCanvas): void {

    }
}