import { IPluginJson } from '../../plugin/IPluginExporter';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { ShapeJson } from '../../models/shapes/AbstractShape';
import { AbstractModuleExporter } from './AbstractModuleExporter';
import { Registry } from '../../Registry';

export interface ViewExporter {
    export(): string;
}

export interface AppJson {
    plugins: IPluginJson[];
    assets: AssetObjJson[];

    viewsByType: {
        viewType: string;
        views: ShapeJson[];
    }[];

    canvas: {[id: string]: ShapeJson[]}

    objs: {[id: string]: ObjJson[]}

    [id: string] : any;
}

export class ExportService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    // private moduleExporters: Map<string, AbstractModuleExporter> = new Map();

    // registerExporter(moduleName: string, exporter: AbstractModuleExporter) {
    //     this.moduleExporters.set(moduleName, exporter);
    // }

    // unRegisterExporter(moduleName: string) {
    //     this.moduleExporters.delete(moduleName);
    // }

    export(): string {
        const json = {
            modules: {}
        };

        const canvases = this.registry.services.module.ui.getAllCanvases();

        canvases
            .filter(canvas => canvas.exporter)
            .forEach((canvas => json.modules[canvas.id] = canvas.exporter.export()));

        return JSON.stringify(json);
    }
}