import { NodeEditorModule, NodeEditorPanelId } from "../../modules/graph_editor/NodeEditorModule";
import { SceneEditorModule, SceneEditorPanelId } from "../../modules/scene_editor/main/SceneEditorModule";
import { AbstractCanvasPanel } from "../models/modules/AbstractCanvasPanel";
import { UI_Panel, UI_Region } from "../models/UI_Panel";
import { AbstractModuleExporter } from "./export/AbstractModuleExporter";
import { AbstractModuleImporter } from "./import/AbstractModuleImporter";

export interface UIModule {
    moduleName: string;
    panels: UI_Panel[];
    exporter?: AbstractModuleExporter;
    importer?: AbstractModuleImporter;
}

export class ModuleService {
    ui: UI_Modules;

    constructor() {
        this.ui = new UI_Modules();
    }
}

export class UI_Modules {
    private canvases: Map<string, AbstractCanvasPanel<any>> = new Map();
    private panels: Map<string, UI_Panel> = new Map();

    nodeEditor: NodeEditorModule;
    sceneEditor: SceneEditorModule;

    registerCanvas(canvas: AbstractCanvasPanel<any>) {
        this.canvases.set(canvas.id, canvas);

        if (canvas.id === NodeEditorPanelId) {
            this.nodeEditor = <NodeEditorModule> canvas;
        } else if (canvas.id === SceneEditorPanelId) {
            this.sceneEditor = <SceneEditorModule> canvas;
        }
    }

    unregisterCanvas(id: string) {
        this.canvases.delete(id);
    }

    getCanvas(id: string) {
        return this.canvases.get(id);
    }

    getAllCanvases(): AbstractCanvasPanel<any>[] {
        return Array.from(this.canvases.values());
    }

    registerPanel(panel: UI_Panel) {
        this.panels.set(panel.id, panel);
    }

    getPanel(id: string) {
        return this.panels.get(id);
    }
}