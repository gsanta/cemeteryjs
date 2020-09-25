import { IObj, ObjJson } from "../../../../core/models/objs/IObj";
import { MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewJson } from "../../../../core/models/views/MeshView";
import { PathView, PathViewJson } from "../../../../core/models/views/PathView";
import { SpriteView, SpriteViewJson, SpriteViewType } from "../../../../core/models/views/SpriteView";
import { ViewJson, ViewType } from "../../../../core/models/views/View";
import { AppJson } from "../../../../core/services/export/ExportService";
import { AbstractPluginImporter } from "../../../../core/services/import/AbstractPluginImporter";

export class SceneEditorImporter extends AbstractPluginImporter {
    private importedObjs: Map<string, IObj> = new Map();

    async import(json: AppJson): Promise<void> {

        const views = json[this.plugin.id].views;

        views.forEach((viewJson: ViewJson) => {
            switch(viewJson.type) {
                case ViewType.MeshView:
                    const meshView = new MeshView();
                    meshView.obj.meshAdapter = this.registry.engine.meshes;
                    meshView.fromJson(viewJson as MeshViewJson, this.registry);
                    this.registry.stores.canvasStore.addView(meshView);
                    this.registry.engine.meshes.createInstance((<MeshView> meshView).obj)
                    break;
                case ViewType.PathView:
                    const pathView = new PathView();
                    pathView.fromJson(viewJson as PathViewJson, this.registry);
                    this.registry.stores.canvasStore.addView(pathView);
                    break;
                case SpriteViewType:
                    const spriteView = new SpriteView();
                    spriteView.obj.spriteAdapter = this.registry.engine.sprites;
                    spriteView.fromJson(viewJson as SpriteViewJson, this.registry);
                    this.registry.stores.canvasStore.addView(spriteView);
                    this.registry.engine.sprites.createInstance(spriteView.obj);
                    break;
            }
        });
    }

    // private importObjs(json: AppJson):  Map<string, IObj> {
    //     const importedObjs: Map<string, IObj> = new Map();

    //     const objs: {objType: string, objs: ObjJson[] }[] = json[this.plugin.id].objs;

    //     objs.forEach(obj => {
    //         switch(obj.objType) {
    //             case MeshObjType:
    //                 importedObjs.set(obj.)
    //         }
    //     });
    // }

    // private importObjType()
}