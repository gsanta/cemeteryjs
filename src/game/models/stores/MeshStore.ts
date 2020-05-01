import { Mesh, Vector3, Space, StandardMaterial, Texture, Scene } from 'babylonjs';
import { MeshObject } from '../objects/MeshObject';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MeshLoaderService } from '../../../editor/services/MeshLoaderService';
import { RectangleFactory } from '../../import/factories/RectangleFactory';
import { Registry } from '../../../editor/Registry';

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
        this.rectangleFactory = new RectangleFactory(registry, 0.1);
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

    createInstance(meshObject: MeshObject, scene: Scene): void {
        if (!meshObject.modelId) {
            const mesh = this.rectangleFactory.createMesh(meshObject, scene);
            this.instances.add(mesh);
            meshObject.setMesh(mesh);
            return;
        }

        const modelConcept = this.registry.stores.canvasStore.getModelConceptById(meshObject.modelId);

        this.registry.services.meshLoader.load(modelConcept, meshObject.id)
            .then(() => this.setupInstance(meshObject, scene));
    }

    private setupInstance(meshObject: MeshObject, scene: Scene) {
        const modelConcept = this.registry.stores.canvasStore.getModelConceptById(meshObject.modelId);

        if (meshObject.texturePath) {
            this.texturePathes.set(modelConcept.modelPath, meshObject.texturePath);
        }

        
        const templateMesh = this.getTemplate(modelConcept.modelPath);

        let clone: Mesh;
        const counter = this.instanceCounter.get(modelConcept.modelPath);

        if (!this.instances.has(templateMesh)) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObject.id;
        }
        this.instances.add(clone);
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(modelConcept.modelPath, counter + 1);
        
        meshObject.meshName = clone.name;

        if (this.texturePathes.get(modelConcept.modelPath)) {
            const texturePath = `${this.basePath}${MeshLoaderService.getFolderNameFromFileName(modelConcept.modelPath)}/${this.texturePathes.get(modelConcept.modelPath)}`;
            (<StandardMaterial> clone.material).diffuseTexture  = new Texture(texturePath,  scene);
            (<StandardMaterial> clone.material).specularTexture  = new Texture(texturePath,  scene);
            meshObject.texturePath = texturePath;
        }

        clone.isVisible = true;
        const scale = meshObject.scale;
        clone.scaling = new Vector3(scale, scale, scale);
        clone.rotationQuaternion = undefined;

        const rect = <Rectangle> meshObject.dimensions;
        const width = rect.getWidth();
        const depth = rect.getHeight();

        clone.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        clone.rotation.y = meshObject.rotation;

        meshObject.setMesh(clone);
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