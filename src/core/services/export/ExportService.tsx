import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { ViewJson } from '../../models/views/View';
import { AbstractModuleExporter } from './IModuleExporter';

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
    private registry: Registry;

    private moduleExporters: Map<string, AbstractModuleExporter> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    registerExporter(moduleName: string, exporter: AbstractModuleExporter) {
        this.moduleExporters.set(moduleName, exporter);
    }

    unRegisterExporter(moduleName: string) {
        this.moduleExporters.delete(moduleName);
    }

    export(): string {
        // const appJson: Partial<AppJson> = {};
        const json = {
            modules: {}
        };

        Array.from(this.moduleExporters.entries()).forEach(([name, exporter]) => json.modules[name] = exporter.export());

        // this.exportObjs(appJson);
        // this.exportViews(appJson);

        return JSON.stringify(json);
    }

    private exportViews(appJson: Partial<AppJson>) {
        appJson.canvas = {};
        this.registry.data.view.node.exportInto(appJson);
        this.registry.data.view.scene.exportInto(appJson);
    }

    private exportObjs(appJson: Partial<AppJson>) {
        appJson.objs = {};
        this.registry.stores.objStore.exportInto(appJson);
        this.registry.stores.assetStore.exportInto(appJson);
        this.registry.data.obj.feature.exportInto(appJson);
    }
}