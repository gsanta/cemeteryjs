import { AbstractPluginImporter } from "../../../../core/plugins/AbstractPluginImporter";
import { AppJson } from "../../../../core/services/export/ExportService";
import { View, ViewType } from "../../../../core/models/views/View";
import { MeshViewJson, MeshView } from "../../../../core/models/views/MeshView";
import { PathViewJson, PathView } from "../../../../core/models/views/PathView";
import { AssetObj, AssetType } from "../../../../core/models/game_objects/AssetObj";
import { ViewGroupJson } from "../../../../core/plugins/IPluginExporter";

export class SceneEditorImporter extends AbstractPluginImporter {
    import(json: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(json);

        const meshJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.MeshView);

        this.importMeshViews(meshJsons, viewMap);

        const pathJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.PathView);

        pathJsons.views.forEach((viewJson: PathViewJson) => {
            const pathView: PathView = new PathView();
            pathView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(pathView);
        });
    }

    private async importMeshViews(viewGroup: ViewGroupJson, viewMap: Map<string, View>) {
        const promises = viewGroup.views.map((viewJson: MeshViewJson) => {
            const meshView: MeshView = new MeshView();
            meshView.fromJson(viewJson, viewMap);
            this.initAssets(meshView);

            this.registry.stores.canvasStore.addMeshView(meshView);

            return meshView;
        });

        Promise.all(promises)
            .catch(e => console.error(e))
            .finally(() => this.plugin.reRender());
    }

    // this.loadAllMeshes(this.registry.stores.canvasStore.getMeshViews())
    // .then(() => {
    //     const promises = this.registry.stores.canvasStore.getMeshViews().map(meshView => this.registry.engine.meshLoader.createInstance(meshView.obj));
    //     return Promise.all(promises);
    // })
    // .then(() => {
    //     this.registry.stores.canvasStore.getMeshViews().forEach(meshView => this.registry.engine.meshLoader.createMaterial(meshView.obj));
    // })
    // .catch(e => {
    //     console.log(e)
    // })

    private initAssets(meshView: MeshView) {
        if (meshView.obj.modelId) {
            const asset = new AssetObj({assetType: AssetType.Model});
            asset.id = meshView.obj.modelId;
            this.registry.stores.assetStore.addObj(asset);
        }
        
        if (meshView.obj.textureId) {
            const asset = new AssetObj({assetType: AssetType.Texture});
            asset.id = meshView.obj.textureId;
            this.registry.stores.assetStore.addObj(asset);
        }
    }

    // private loadAllMeshes(meshViews: MeshView[]): Promise<Mesh[]> {
    //     return new Promise((resolve, reject) => {
    //         const promises: Promise<Mesh>[] = [];

    //         meshViews
    //             .filter(meshView => meshView.obj.modelId)
    //             .forEach(meshView => {
    //                 this.registry.engine.meshLoader.load(meshView.obj);
                    
    //                 const loadingMesh = this.registry.engine.meshLoader.load(meshView.obj);
    //                 promises.push(loadingMesh);
    //             });
    
    //         Promise.all(promises)
    //             .then((meshes) => resolve(meshes))
    //             .catch(() => reject());
    //     });
    // }

    // private setMeshDimensions() {
    //     this.registry.stores.canvasStore.getMeshViews()
    //         .filter(item => item.obj.modelId)
    //         .forEach(meshView => {
    //             this.registry.engine.meshLoader.getDimensions(meshView.obj)
    //                 .then(dim => {
    //                     meshView.dimensions.setWidth(dim.x);
    //                     meshView.dimensions.setHeight(dim.y);
    //                 });
    //         });
    // }
}