import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IObj';
import { IDataExporter } from './IDataExporter';
import { SpriteSheetExporter } from './SpriteSheetExporter';
import { AssetObjExporter } from './AssetObjExporter';
import { ViewJson } from '../../models/views/View';

export interface ViewExporter {
    export(): string;
}

export interface AppJson {
    plugins: IPluginJson[];
    assets: AssetObjJson[];

    objs: {
        objType: string;
        objs: ObjJson[];
    }[];

    viewsByType: {
        viewType: string;
        views: ViewJson[];
    }[];

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
        this.registry.stores.views.getAllTypes().forEach(viewType => {
            const viewJsons = this.registry.stores.views.getViewsByType(viewType).map(view => view.toJson());

            if (!appJson.viewsByType) {
                appJson.viewsByType = [];
            }

            appJson.viewsByType.push({viewType, views: viewJsons});
        });
    }

    private exportObjs(appJson: Partial<AppJson>) {
        this.registry.stores.objStore.getAllTypes().forEach(objType => {
            const objJsons = this.registry.stores.objStore.getObjsByType(objType).map(obj => obj.serialize());

            if (!appJson.objs) {
                appJson.objs = [];
            }

            appJson.objs.push({objType, objs: objJsons});
        });
    }
}