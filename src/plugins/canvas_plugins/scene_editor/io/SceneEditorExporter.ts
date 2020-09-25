import { ObjJson } from "../../../../core/models/objs/IObj";
import { Registry } from "../../../../core/Registry";
import { AppJson } from "../../../../core/services/export/ExportService";
import { IDataExporter } from "../../../../core/services/export/IDataExporter";
import { SceneEditorPlugin } from "../SceneEditorPlugin";

export class SceneEditorExporter implements IDataExporter {
    private plugin: SceneEditorPlugin;
    private registry: Registry;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    export(json: Partial<AppJson>): void {
        this.exportViews(json);
        this.exportObjs(json);
    }

    private exportViews(json: Partial<AppJson>): void {
        json[this.plugin.id] = {
            views: this.registry.stores.viewStore.getAllViews().map(view => view.toJson())
        }
    }

    private exportObjs(json: Partial<AppJson>): void {
        if (this.registry.stores.viewStore.getAllTypes().length === 0) { return; }

        this.registry.stores.viewStore.getAllTypes().forEach(type => {
            if (!json.objs) {
                json.objs = [];
            }

            const objs: {objType: string, objs: ObjJson[] } = {
                objType: type,
                objs: []
            };
    
            json.objs.push(objs);
    
            this.registry.stores.viewStore.getViewsByType(type).forEach(spriteSheetObj => objs.objs.push(spriteSheetObj.toJson()));
        });

    }
}