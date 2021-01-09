import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { IDataExporter } from './IDataExporter';
import { ViewJson } from '../../models/views/View';

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
    private exporters: IDataExporter[] = []

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        const appJson: Partial<AppJson> = {};

        this.exporters.forEach(exporter => exporter.export(appJson));

        this.exportObjs(appJson);
        this.exportViews(appJson);

        this.registry.plugins.getAll().filter(plugin => plugin.exporter).map(plugin => plugin.exporter.export(appJson));
        return JSON.stringify(appJson);
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