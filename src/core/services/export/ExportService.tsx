import { IPluginJson } from '../../plugin/IPluginExporter';
import { Registry } from '../../Registry';
import { AssetObjJson } from '../../models/objs/AssetObj';
import { ObjJson } from '../../models/objs/IGameObj';
import { IDataExporter } from './IDataExporter';
import { SpriteSheetExporter } from './SpriteSheetExporter';
import { AssetObjExporter } from './AssetObjExporter';

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

    [id: string] : any;
}

export class ExportService {
    serviceName = 'export-service';
    private registry: Registry;
    private exporters: IDataExporter[] = []

    constructor(registry: Registry) {
        this.registry = registry;

        this.exporters.push(new AssetObjExporter(registry));
        this.exporters.push(new SpriteSheetExporter(registry));
    }

    export(): string {
        const appJson: Partial<AppJson> = {};

        this.exporters.forEach(exporter => exporter.export(appJson));

        this.registry.plugins.getAll().filter(plugin => plugin.exporter).map(plugin => plugin.exporter.export(appJson));
        return JSON.stringify(appJson);
    }
}