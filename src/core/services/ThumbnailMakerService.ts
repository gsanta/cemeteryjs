import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, PointLight, MeshBuilder, Tools, Camera, Light } from "babylonjs";
import { AssetModel } from "../stores/AssetStore";
import { MeshLoaderService } from "./MeshLoaderService";
import { Registry } from "../Registry";
import { ImportSettings } from "../../plugins/scene_editor/settings/ImportSettings";
import { MeshSettings } from "../../plugins/scene_editor/settings/MeshSettings";

export class ThumbnailMakerService extends MeshLoaderService {
    private engine: Engine;
    private scene: Scene;
    private camera: Camera;
    private light: Light;

    getScene() {
        return this.scene;
    }

    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
        this.camera = new ArcRotateCamera("Camera", Math.PI / 2, 0, 40, Vector3.Zero(), this.scene);
        this.light = new HemisphericLight("light1", new Vector3(1, 5, 0), this.scene);

        const meshSettings = this.registry.services.plugin.sceneEditor.getSettingsByName<MeshSettings>(MeshSettings.type);
        this.createThumbnail(this.registry.stores.assetStore.getAssetById(meshSettings.meshConcept.modelId));
        // var sphere = MeshBuilder.CreateSphere("sphere", {}, this.scene);

        // setTimeout(() => {
        //     this.scene.render()
        // }, 3000)
        // Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera, 300);
        this.engine.runRenderLoop(() => this.scene.render());
    }

    destroy() {
        this.engine.dispose();
    }

    createThumbnail(assetModel: AssetModel) {
        this.load(assetModel, '123')
            .then(mesh => {
                    this.scene.render()
                    // Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera, 1000, (data) => {
                    //     console.log(data);
                    //     assetModel.thumbnailData = data;
                    // });
                }
            );
    }
}