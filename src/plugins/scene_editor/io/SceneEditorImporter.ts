import { MeshView, MeshViewJson } from '../../../core/models/views/MeshView';
import { PathView, PathViewJson } from '../../../core/models/views/PathView';
import { ViewType, View } from "../../../core/models/views/View";
import { AppJson } from '../../../core/services/export/ExportService';
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";
import { AssetModel } from '../../../core/models/game_objects/AssetModel';

export class SceneEditorImporter extends AbstractPluginImporter {
    import(json: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(json);

        const meshJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.MeshView);

        meshJsons.views.forEach((viewJson: MeshViewJson) => {
            const meshView: MeshView = new MeshView();
            meshView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(meshView);
        });

        const pathJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ViewType.PathView);

        pathJsons.views.forEach((viewJson: PathViewJson) => {
            const pathView: PathView = new PathView();
            pathView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addView(pathView);
        });
    }

    // private loadAssets(meshView: MeshView) {        
    //     const assetModel = new AssetModel();
    //     assetModel.fromJson(assetJson);
    //     this.registry.stores.assetStore.addAsset(assetModel);
    // }
}