import { Mesh, Vector3, Space, StandardMaterial, Texture, Scene } from 'babylonjs';
import { MeshObject } from '../objects/MeshObject';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MeshLoaderService } from '../../../editor/services/MeshLoaderService';

export class MeshStore {
    private basePath = 'assets/models/';
    private templates: Set<Mesh> = new Set();
    private templatesByFileName: Map<string, Mesh> = new Map();
    private templateFileNames: Map<Mesh, string> = new Map();
    private texturePathes: Map<string, string> = new Map();

    private instanceCounter: Map<string, number> = new Map();

    addTemplate(fileName: string, mesh: Mesh) {
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

    createInstance(meshObject: MeshObject, scene: Scene): Mesh {
        if (meshObject.texturePath) {
            this.texturePathes.set(meshObject.modelPath, meshObject.texturePath);
        }
        
        const templateMesh = this.getTemplate(meshObject.modelPath);

        let clone: Mesh;
        const counter = this.instanceCounter.get(meshObject.modelPath);

        if (counter === 0) {
            clone = templateMesh;
        } else {
            clone = <Mesh> templateMesh.instantiateHierarchy();
            clone.name = meshObject.id;
        }
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(meshObject.modelPath, counter + 1);
        
        meshObject.meshName = clone.name;

        if (this.texturePathes.get(meshObject.modelPath)) {
            const texturePath = `${this.basePath}${MeshLoaderService.getFolderNameFromFileName(meshObject.modelPath)}/${this.texturePathes.get(meshObject.modelPath)}`;
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

        return clone;
    }

    clear(): void {
        this.templates.forEach(template => template.dispose());
        this.templates.clear();
        this.templatesByFileName = new Map();
    }
}