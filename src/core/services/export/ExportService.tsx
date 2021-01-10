import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { ViewJson } from '../../models/views/View';
import { AbstractModuleExporter } from './AbstractModuleExporter';

export interface ViewExporter {
    export(): string;
}

export interface AppJson {
    plugins: IPluginJson[];
    assets: AssetObjJson[];

    viewsByType: {
        viewType: string;
        views: ViewJson[];
    }[];

    canvas: {[id: string]: ViewJson[]}

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