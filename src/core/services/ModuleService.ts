import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";
import { UI_Panel, UI_Region } from "../plugin/UI_Panel";
import { Registry } from "../Registry";
import { AbstractModuleExporter } from "./export/AbstractModuleExporter";
import { AbstractModuleImporter } from "./import/AbstractModuleImporter";

export interface UIModule {
    moduleName: string;
    panels: UI_Panel[];
    exporter?: AbstractModuleExporter;
    importer?: AbstractModuleImporter;
}

export class ModuleService {
    private registry: Registry;
    private uiModules: UIModule[] = [];
    ui: UI_Modules;

    constructor(registry: Registry) {
        this.registry = registry;
        this.ui = new UI_Modules();
    }

    registerUIModule(uiModule: UIModule) {
        this.registerPanels(uiModule.panels);
        this.uiModules.push(uiModule);
    }

    unRegisterModule(moduleName: string) {
        // TODO implement unregistration
    }

    private registerPanels(panels: UI_Panel[]) {
        panels.forEach(panel => {
            switch(panel.region) {
                case UI_Region.Canvas1:
                case UI_Region.Canvas2:
                    this.ui.registerCanvas(<AbstractCanvasPanel> panel);
                    break;
                default:
                    this.ui.registerPanel(panel);
                    break;
            }
        });
    }
}

export class UI_Modules {
    private canvases: Map<string, AbstractCanvasPanel> = new Map();
    private panels: Map<string, UI_Panel> = new Map();

    registerCanvas(canvas: AbstractCanvasPanel) {
        this.canvases.set(canvas.id, canvas);
    }

    unregisterCanvas(id: string) {
        this.canvases.delete(id);
    }

    getCanvas(id: string) {
        return this.canvases.get(id);
    }

    getAllCanvases(): AbstractCanvasPanel[] {
        return Array.from(this.canvases.values());
    }

    registerPanel(panel: UI_Panel) {
        this.panels.set(panel.id, panel);
    }

    getPanel(id: string) {
        return this.panels.get(id);
    }
}