import { AbstractPluginService } from "../../common/AbstractPluginService";
import { AbstractPlugin } from "../../../core/AbstractPlugin";
import { MeshLoaderService } from "../../../core/services/MeshLoaderService";
import { Tools } from "babylonjs";
import { MeshView } from "../../../core/models/views/MeshView";
import { Point } from "../../../core/geometry/shapes/Point";
import { AssetModel } from "../../../core/models/game_objects/AssetModel";

export class ThumbnailMakerService extends AbstractPluginService<AbstractPlugin> {
    static serviceName = 'thumbnail-maker-service';
    serviceName = ThumbnailMakerService.serviceName;

    private meshView: MeshView;

    loadSelectedMeshView() {
        const meshView = this.registry.stores.selectionStore.getView() as MeshView;
        const assetModel = this.registry.stores.assetStore.getAssetById(meshView.modelId);

        return this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).load(assetModel, meshView.id)
            .then(() => this.meshView = meshView);
    }

    createThumbnail(assetModel: AssetModel) {
        const engineService = this.plugin.pluginServices.engineService();

        Tools.CreateScreenshotUsingRenderTarget(engineService.getEngine(), engineService.getCamera().camera, 1000, (data) => {
            assetModel.thumbnailData = data;
        });
    }

    private getDimensions(): Point {
        const mesh = this.meshView.mesh;

        mesh.computeWorldMatrix();
        mesh.getBoundingInfo().update(mesh._worldMatrix);

        const boundingVectors = mesh.getHierarchyBoundingVectors();
        const width = boundingVectors.max.x - boundingVectors.min.x;
        const height = boundingVectors.max.z - boundingVectors.min.z;
        let dimensions = new Point(width, height).mul(10);

        dimensions.x  = dimensions.x < 10 ? 10 : dimensions.x;
        dimensions.y  = dimensions.y < 10 ? 10 : dimensions.y;
        return dimensions;
    }
}
