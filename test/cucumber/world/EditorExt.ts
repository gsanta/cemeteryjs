import { Editor } from "../../../src/core/Editor";
import { Test_EngineFacade } from "../../../src/core/engine/adapters/test/Test_EngineFacade";
import { Wrap_EngineFacade } from "../../../src/core/engine/adapters/wrapper/Wrap_EngineFacade";
import { UI_Region } from "../../../src/core/plugin/UI_Panel";
import { SceneEditorPanelId } from "../../../src/plugins/canvas_plugins/scene_editor/registerSceneEditor";

class FakeRenderer {

    renderPanel1() {

    }

    renderPanel2() {
        
    }

    renderSidePanel() {

    }

    renderDialog() {

    }
}

export class EditorExt extends Editor {
    private fakeRenderer: FakeRenderer;

    constructor() {
        super();
        this.fakeRenderer = new FakeRenderer();
    }

    setup() {
        this.registry.ui.canvas.getCanvas(SceneEditorPanelId).mounted(undefined);
        this.registry.services.render.setRenderer(UI_Region.Canvas1, () => this.fakeRenderer.renderPanel1());
        this.registry.services.render.setRenderer(UI_Region.Canvas2, () => this.fakeRenderer.renderPanel2());
        this.registry.services.render.setRenderer(UI_Region.Sidepanel, () => this.fakeRenderer.renderSidePanel());
        this.registry.services.render.setRenderer(UI_Region.Dialog, () => this.fakeRenderer.renderDialog());
        this.registry.services.render.setRootRenderer(() => this.fakeRenderer.renderDialog());
        const wrapEngine = new Wrap_EngineFacade(this.registry, undefined);
        wrapEngine.realEngine = new Test_EngineFacade(this.registry);
        this.registry.engine = wrapEngine;
    }
}