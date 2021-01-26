import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { ShapeJson } from '../../models/shapes/AbstractShape';
import { AbstractModuleExporter } from './AbstractModuleExporter';

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
    private moduleExporters: Map<string, AbstractModuleExporter> = new Map();

    registerExporter(moduleName: string, exporter: AbstractModuleExporter) {
        this.moduleExporters.set(moduleName, exporter);
    }

    unRegisterExporter(moduleName: string) {
        this.moduleExporters.delete(moduleName);
    }

    export(): string {
        const json = {
            modules: {}
        };

        Array.from(this.moduleExporters.entries()).forEach(([name, exporter]) => json.modules[name] = exporter.export());

        return JSON.stringify(json);
    }
}