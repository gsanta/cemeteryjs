import { Tools } from "babylonjs";
import { Bab_EngineFacade } from "../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { Canvas3dPanel } from "../../../core/plugin/Canvas3dPanel";
import { ParamControllers, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { MeshView } from "../../canvas_plugins/scene_editor/views/MeshView";
import { ThumbnailCanvasId } from "./registerThumbnailCanvas";

export class ThumbnailDialogControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();

        const canvas = <Canvas3dPanel> registry.ui.canvas.getCanvas(ThumbnailCanvasId);

        this.createFromModel = new ThumbnailCreateControl(registry, canvas);
        this.createFromFile = new ThumbnailUploadControl(registry);
        this.newProject = new ClearThumbnailControl(registry);
    }

    createFromModel: ThumbnailCreateControl;
    createFromFile: ThumbnailUploadControl;
    clearThumbnail: ClearThumbnailControl;
}

export class ThumbnailCreateControl extends PropController {
    private panel: Canvas3dPanel;

    constructor(registry: Registry, panel: Canvas3dPanel) {
        super(registry);

        this.panel = panel;
    }
    
    async click() {
        const engine = this.panel.engine;
        const meshView = this.registry.data.view.scene.getOneSelectedView() as MeshView;

        // TODO: should not cast to Bab_EngineFacade
        const thumbnail = await Tools.CreateScreenshotUsingRenderTargetAsync((engine as Bab_EngineFacade).engine, engine.getCamera().camera, 1000)
        meshView.thumbnailData = thumbnail;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ThumbnailUploadControl extends PropController {

    change(val) {
        const meshView = this.registry.data.view.scene.getOneSelectedView() as MeshView;
                
        meshView.thumbnailData = val.data;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ClearThumbnailControl extends PropController {
    change(val) {
        const meshView = this.registry.data.view.scene.getOneSelectedView() as MeshView;
 
        meshView.thumbnailData = undefined;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}