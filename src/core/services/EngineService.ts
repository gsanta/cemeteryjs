import { Color3, Engine, HemisphericLight, Light, Scene, Vector3 } from "babylonjs";
import { Camera3D } from "../../plugins/common/camera/Camera3D";
import { AbstractPluginService } from "../../plugins/common/AbstractPluginService";
import { AbstractPlugin } from "../AbstractPlugin";

export class EngineService<T extends AbstractPlugin> extends AbstractPluginService<T> {
    static serviceName = 'engine-service';
    serviceName = EngineService.serviceName;
    private engine: Engine;
    private scene: Scene;
    private camera: Camera3D;
    private light: Light;

    getScene() {
        return this.scene;
    }

    awake() {
        // TODO get rid of this, and call destroy everywhere it is needed
        if (this.engine) { this.engine.dispose(); }

        const canvasElement = this.plugin.htmlElement as HTMLCanvasElement;

        this.engine = new Engine(canvasElement, true, { preserveDrawingBuffer: true, stencil: true });
        // TODO check if needed, there was some weird bug in babylon why this was needed 
        this.engine.getInputElement = () => canvasElement;
        
        this.scene = new Scene(this.engine);
        this.camera = new Camera3D(this.registry, this.engine, this.scene);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.light.diffuse = new Color3(1, 1, 1);
        this.light.specular = new Color3(0, 0, 0);

        // const meshSettings = this.registry.services.plugin.sceneEditor.getSettingsByName<MeshSettings>(MeshSettings.type);
        // this.createThumbnail(this.registry.stores.assetStore.getAssetById(meshSettings.meshConcept.modelId));
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

    // createThumbnail(assetModel: AssetModel) {
    //     this.load(assetModel, '123')
    //         .then(mesh => {
    //                 this.scene.render()
    //                 // Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera, 1000, (data) => {
    //                 //     console.log(data);
    //                 //     assetModel.thumbnailData = data;
    //                 // });
    //             }
    //         );
    // }
}