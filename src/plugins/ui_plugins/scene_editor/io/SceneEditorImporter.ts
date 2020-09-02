import { AssetObj, AssetType } from "../../../../core/models/game_objects/AssetObj";
import { MeshView } from "../../../../core/models/views/MeshView";
import { PathView } from "../../../../core/models/views/PathView";
import { SpriteView, SpriteViewType } from "../../../../core/models/views/SpriteView";
import { View, ViewJson, ViewType } from "../../../../core/models/views/View";
import { AbstractPluginImporter } from "../../../../core/plugins/AbstractPluginImporter";
import { ViewGroupJson } from "../../../../core/plugins/IPluginExporter";
import { AppJson } from "../../../../core/services/export/ExportService";

export class SceneEditorImporter extends AbstractPluginImporter {
    import(json: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(json);

        pluginJson.viewGroups.forEach(viewGroup => this.importViewGroup(viewGroup, viewMap));
    }

    private importViewGroup(viewGroup: ViewGroupJson, viewMap: Map<string, View>) {
        viewGroup.views.map((viewJson: ViewJson) => {
            const view = this.createView(viewJson);
            // TODO why do we have to cast to any?
            view.fromJson(viewJson as any, viewMap);

            switch(viewJson.type) {
                case ViewType.MeshView:
                    this.initAssets(view as MeshView);
                    break;
            }

            this.registry.stores.canvasStore.addView(view);

            return view;
        });
    }

    private createView(viewJson: ViewJson) {
        switch(viewJson.type) {
            case ViewType.MeshView:
                return new MeshView();
            case ViewType.PathView:
                return new PathView();
            case SpriteViewType:
                const spriteView = new SpriteView();
                spriteView.obj.spriteAdapter = this.registry.engine.sprites;
                return spriteView;
        }
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
    }
}