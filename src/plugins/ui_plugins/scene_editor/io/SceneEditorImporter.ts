import { AbstractPluginImporter } from "../../../../core/plugins/AbstractPluginImporter";
import { AppJson } from "../../../../core/services/export/ExportService";
import { View, ViewType } from "../../../../core/models/views/View";
import { MeshViewJson, MeshView } from "../../../../core/models/views/MeshView";
import { PathViewJson, PathView } from "../../../../core/models/views/PathView";
import { AssetObj, AssetType } from "../../../../core/models/game_objects/AssetObj";

export class SceneEditorImporter extends AbstractPluginImporter {
    import(json: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(json);

        const meshJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.MeshView);

        const promises = meshJsons.views.map((viewJson: MeshViewJson) => {
            const meshView: MeshView = new MeshView();
            meshView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(meshView);
            this.initAssets(meshView);

            return meshView;
        })
        .filter((meshView: MeshView) => meshView.thumbnailId)
        .map((meshView: MeshView) => this.registry.services.localStore.loadAsset(this.registry.stores.assetStore.getAssetById(meshView.thumbnailId)));

        Promise.all(promises)
            .catch(e => console.error(e))
            .finally(() => this.plugin.reRender());

        const pathJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.PathView);

        pathJsons.views.forEach((viewJson: PathViewJson) => {
            const pathView: PathView = new PathView();
            pathView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(pathView);
        });
    }

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

        if (meshView.thumbnailId) {
            const asset = new AssetObj({assetType: AssetType.Thumbnail});
            asset.id = meshView.thumbnailId;
            this.registry.stores.assetStore.addObj(asset);
        }    
    }
}