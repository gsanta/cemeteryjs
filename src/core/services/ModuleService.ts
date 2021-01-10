import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";
import { UI_Panel, UI_Region } from "../plugin/UI_Panel";
import { Registry } from "../Registry";
import { AbstractModuleExporter } from "./export/IModuleExporter";

export interface UIModule {
    moduleName: string;
    panels: UI_Panel[];
    exporter?: AbstractModuleExporter;
}


export class ModuleService {
    private registry: Registry;
    private uiModules: UIModule[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
    }

    registerUIModule(uiModule: UIModule) {
        this.registerPanels(uiModule.panels);
        uiModule.exporter && this.registerExporter(uiModule.moduleName, uiModule.exporter);
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
                    this.registry.ui.canvas.registerCanvas(<AbstractCanvasPanel> panel);
                    break;
                default:
                    this.registry.ui.panel.registerPanel(panel);
                    break;
            }
        });
    }

    private registerExporter(moduleName: string, exporter: AbstractModuleExporter) {
        this.registry.services.export.registerExporter(moduleName, exporter);
    }
}