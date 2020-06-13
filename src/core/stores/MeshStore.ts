import { Mesh, Vector3, Space, StandardMaterial, Texture, Scene } from 'babylonjs';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { MeshLoaderService } from '../services/MeshLoaderService';
import { RectangleFactory } from './RectangleFactory';
import { Registry } from '../Registry';
import { MeshModel } from '../models/game_objects/MeshModel';
import { EngineService } from '../services/EngineService';

export class MeshStore {
    private basePath = 'assets/models/';
    private templates: Set<Mesh> = new Set();
    private templatesByFileName: Map<string, Mesh> = new Map();
    private templateFileNames: Map<Mesh, string> = new Map();
    private texturePathes: Map<string, string> = new Map();

    private instances: Set<Mesh> = new Set();

    private instanceCounter: Map<string, number> = new Map();

    private rectangleFactory: RectangleFactory;
    private registry: Registry;

    constructor(registry: Registry) {
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

    createInstance(meshModel: MeshModel): void {
        // TODO MeshStore should be instantiated by GameViewerPlugin and pass itself in constructor instead of directly accessing it here
        // so MeshStore later can be used for GamePlugin
        const engineService = this.registry.services.plugin.gameView.pluginServices.byName<EngineService>(EngineService.serviceName);
         // TODO same as above
        const meshLoaderService = this.registry.services.plugin.gameView.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        if (!meshModel.meshView.modelId) {
            const mesh = this.rectangleFactory.createMesh(meshModel.meshView, engineService.getScene());
            this.instances.add(mesh);
            meshModel.meshView.mesh = mesh;
            return;
        }

        const modelConcept = this.registry.stores.assetStore.getAssetById(meshModel.meshView.modelId);

        meshLoaderService.load(modelConcept, meshModel.meshView.id)
            .then(() => this.setupInstance(meshModel, engineService.getScene()));
    }

    private setupInstance(meshModel: MeshModel, scene: Scene) {
        const texture = this.registry.stores.assetStore.getAssetById(meshModel.meshView.textureId);
        const model = this.registry.stores.assetStore.getAssetById(meshModel.meshView.modelId);

        if (model) {
            this.texturePathes.set(model.path, texture ? texture.path : undefined);
        }

        const templateMesh = this.getTemplate(model.path);

        let clone: Mesh;
        const counter = this.instanceCounter.get(model.path);

        if (!this.instances.has(templateMesh)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshModel.meshView.id;
        }
        this.instances.add(clone);
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(model.path, counter + 1);
        
        meshModel.meshView.meshName = clone.name;

        if (this.texturePathes.get(model.path)) {
            const texturePath = `${this.basePath}${MeshLoaderService.getFolderNameFromFileName(model.path)}/${this.texturePathes.get(model.path)}`;
            (<StandardMaterial> clone.material).diffuseTexture  = new Texture(texturePath,  scene);
            (<StandardMaterial> clone.material).specularTexture  = new Texture(texturePath,  scene);
        }

        clone.isVisible = true;
        const scale = meshModel.meshView.scale;
        clone.scaling = new Vector3(scale, scale, scale);
        clone.position.y = meshModel.meshView.yPos;
        clone.rotationQuaternion = undefined;

        const rect = <Rectangle> meshModel.meshView.dimensions.div(10);
        const width = rect.getWidth();
        const depth = rect.getHeight();

        clone.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        clone.rotation.y = meshModel.meshView.rotation;

        meshModel.meshView.mesh = clone;
    }

    clear(): void {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.instances.forEach(instance => instance.dispose());
        this.instances.clear();
        this.templatesByFileName = new Map();
        this.templateFileNames = new Map();
        this.texturePathes = new Map();
    }
}