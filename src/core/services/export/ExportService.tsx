import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { IDataExporter } from './IDataExporter';
import { AssetObjExporter } from './AssetObjExporter';
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
    objs: ObjJson[];

    [id: string] : any;
}

export class ExportService {
    private registry: Registry;
    private exporters: IDataExporter[] = []

    constructor(registry: Registry) {
        this.registry = registry;

        this.exporters.push(new AssetObjExporter(registry));
        // this.exporters.push(new SpriteSheetExporter(registry));
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
        this.registry.data.view.node.exportInto(appJson);
        this.registry.data.view.scene.exportInto(appJson);
    }

    private exportObjs(appJson: Partial<AppJson>) {
        this.registry.stores.objStore.exportInto(appJson);
    }
}