import { Mesh, Vector3, StandardMaterial, Texture, Scene } from 'babylonjs';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { MeshLoaderService } from '../services/MeshLoaderService';
import { RectangleFactory } from './RectangleFactory';
import { Registry } from '../Registry';
import { MeshModel } from '../models/game_objects/MeshModel';
import { EngineService } from '../services/EngineService';
import { TextureLoaderService } from '../services/TextureLoaderService';
import { AbstractStore } from './AbstractStore';

export class MeshStore extends AbstractStore {
    static id = 'mesh-store'; 
    id = MeshStore.id;

    private templates: Set<Mesh> = new Set();
    private templatesByFileName: Map<string, Mesh> = new Map();
    private templateFileNames: Map<Mesh, string> = new Map();
    private texturePathes: Map<string, string> = new Map();

    private instances: Set<Mesh> = new Set();

    private instanceCounter: Map<string, number> = new Map();

    private rectangleFactory: RectangleFactory;
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
        this.rectangleFactory = new RectangleFactory(0.1);
    }
    
    addTemplate(fileName: string, mesh: Mesh) {
        mesh.name = `template-${fileName}`;
        this.templates.add(mesh);
        this.templatesByFileName.set(fileName, mesh);
        this.templateFileNames.set(mesh, fileName);
        this.instanceCounter.set(fileName, 0);
    }

    deleteTemplate(fileName: string) {
        const mesh = this.templatesByFileName.get(fileName);
        
        if (this.templates.has(mesh)) {
            mesh.isVisible = false;
            const fileName = this.templateFileNames.get(mesh);
            this.instanceCounter.set(fileName, 0);
        }
    }

    getTemplate(fileName: string): Mesh {
        return this.templatesByFileName.get(fileName);
    }

    deleteInstance(mesh: Mesh) {
        if (this.templates.has(mesh)) {
            mesh.isVisible = false;
        } else {
            mesh.dispose();
        }

        this.instances.delete(mesh);
    }

    createInstance(meshModel: MeshModel): Promise<void> {

        return new Promise(resolve => {
            // TODO MeshStore should be instantiated by GameViewerPlugin and pass itself in constructor instead of directly accessing it here
            // so MeshStore later can be used for GamePlugin
            const engineService = this.registry.plugins.gameView.pluginServices.byName<EngineService>(EngineService.serviceName);
             // TODO same as above
            const meshLoaderService = this.registry.plugins.gameView.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
            if (!meshModel.meshView.modelId) {
                const mesh = this.rectangleFactory.createMesh(meshModel.meshView, engineService.getScene());
                this.instances.add(mesh);
                meshModel.meshView.mesh = mesh;
                return;
            }
    
            const modelModel = this.registry.stores.assetStore.getAssetById(meshModel.meshView.modelId);
    
            meshLoaderService.load(modelModel, meshModel.meshView.id)
                .then(() => this.setupInstance(meshModel, engineService.getScene()))
                .then(() => resolve());
        })
    }

    createMaterial(meshModel: MeshModel) {
        const engineService = this.registry.plugins.gameView.pluginServices.byName<EngineService>(EngineService.serviceName);
        const textureModel = this.registry.stores.assetStore.getAssetById(meshModel.meshView.textureId);

        if (!meshModel.meshView.mesh) {
            return;
        }

        const textureLoaderService = this.registry.plugins.gameView.pluginServices.byName<TextureLoaderService>(TextureLoaderService.serviceName);

        textureLoaderService.load(textureModel)
            .then(() => {
                (<StandardMaterial> meshModel.meshView.mesh.material).diffuseTexture  = new Texture(textureModel.data,  engineService.getScene());
                (<StandardMaterial> meshModel.meshView.mesh.material).specularTexture  = new Texture(textureModel.data,  engineService.getScene());
            })
    }

    private setupInstance(meshModel: MeshModel, scene: Scene) {
        const texture = this.registry.stores.assetStore.getAssetById(meshModel.meshView.textureId);
        const model = this.registry.stores.assetStore.getAssetById(meshModel.meshView.modelId);

        if (model) {
            this.texturePathes.set(model.id, texture ? model.id : undefined);
        }

        const templateMesh = this.getTemplate(model.id);

        let clone: Mesh;
        const counter = this.instanceCounter.get(model.id);

        if (!this.instances.has(templateMesh)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshModel.meshView.id;
        }
        this.instances.add(clone);
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(model.id, counter + 1);
        
        meshModel.meshView.meshName = clone.name;


        clone.isVisible = true;
        const scale = meshModel.meshView.getScale();
        clone.scaling = new Vector3(scale, scale, scale);
        clone.position.y = meshModel.meshView.yPos;
        clone.rotationQuaternion = undefined;

        const rect = <Rectangle> meshModel.meshView.dimensions.div(10);
        const width = rect.getWidth();
        const depth = rect.getHeight();

        clone.setAbsolutePosition(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2));

        clone.rotation.y = meshModel.meshView.getRotation();

        meshModel.meshView.mesh = clone;
    }

    clear(): void {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.instanceCounter = new Map();
        this.instances.forEach(instance => this.deleteInstance(instance));
        this.instances.clear();
        this.templatesByFileName = new Map();
        this.templateFileNames = new Map();
        this.texturePathes = new Map();
    }
}