import { Registry } from '../../Registry';
import { AppJson } from '../export/ExportService';
import { IDataImporter } from './IDataImporter';
import { AssetObjImporter } from './AssetObjImporter';
import { AssetObjType } from '../../models/objs/AssetObj';
import { SpriteSheetObjType } from '../../models/objs/SpriteSheetObj';
import { NodeObj, NodeObjJson, NodeObjType } from '../../models/objs/NodeObj';
import { NodeViewType } from '../../models/views/NodeView';

export class ImportService {
    private registry: Registry;
    private importers: IDataImporter[] = [];

    constructor(registry: Registry) {
        this.registry = registry;

        this.importers.push(new AssetObjImporter(registry));
    }

    async import(file: string): Promise<void> {
        const json = <AppJson> JSON.parse(file);

        try {
            for (let i = 0; i < this.importers.length; i++) {
                await this.importers[i].import(json);
            }
        } catch (e) {
            console.error(e);
        }

        this.importObjs(json);
        this.importViews(json);

        const promises: Promise<void>[] = [];

        const plugins = this.registry.plugins.getAll().filter(plugin => plugin.importer);
        
        try {
            for (let i = 0; i < plugins.length; i++) {
                await plugins[i].importer.import(json);
            }
        } catch (e) {
            console.error(e);
        }

        this.registry.services.render.reRenderAll();
    }

    private importObjs(json: AppJson) {
        // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
        json.objs.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
        json.objs.forEach(objType => {
            if (objType.objType === AssetObjType) {
                return;
            }
            objType.objs.forEach(obj => {
                // TODO can be removed when there will be only a single NodeObject
                if (objType.objType === NodeObjType) {
                    this.registry.services.node.currentNodeType = (<NodeObjJson> obj).type;
                }
                const objInstance = this.registry.services.objService.createObj(objType.objType);
                objInstance.fromJson(obj, this.registry);
                this.registry.stores.objStore.addObj(objInstance);
            });
        });
    }

    private importViews(json: AppJson) {
        json.viewsByType.forEach(viewType => {
            viewType.views.forEach(view => {
                // TODO can be removed when there will be only a single NodeObject
                if (view.type === NodeViewType) {
                    const nodeType = (<NodeObj> this.registry.stores.objStore.getById(view.objId)).type;
                    this.registry.services.node.currentNodeType = nodeType;
                }
                const viewInstance = this.registry.services.viewService.createView(viewType.viewType);
                viewInstance.fromJson(view, this.registry);
                this.registry.stores.viewStore.addView(viewInstance);
            });
        });    
    }
}