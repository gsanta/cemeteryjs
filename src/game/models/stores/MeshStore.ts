import { Mesh, Vector3, Space, StandardMaterial, Texture, Scene } from 'babylonjs';
import { MeshObject } from '../objects/MeshObject';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MeshLoaderService } from '../../../editor/services/MeshLoaderService';

export class MeshStore {
    private basePath = 'assets/models/';
    private allInstances: Mesh[] = [];
    private meshMap: Map<string, Mesh> = new Map();
    private templates: Set<Mesh> = new Set();
    private templatesByFileName: Map<string, Mesh> = new Map();
    private templateFileNames: Map<Mesh, string> = new Map();
    private texturePathes: Map<string, string> = new Map();

    private instanceCounter: Map<string, number> = new Map();

    addModel(uniqueId: string, fileName: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.allInstances.push(mesh);
        this.templates.add(mesh);
        this.templatesByFileName.set(fileName, mesh);
        this.templateFileNames.set(mesh, fileName);
        this.instanceCounter.set(fileName, 0);
    }

    addMesh(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.allInstances.push(mesh);
    }

    addClone(uniqueId: string, mesh: Mesh) {
        this.meshMap.set(uniqueId, mesh);
        this.allInstances.push(mesh);
    }

    deleteMesh(id: string) {
        const mesh = this.meshMap.get(id);
        
        if (this.templates.has(mesh)) {
            mesh.isVisible = false;
            const fileName = this.templateFileNames.get(mesh);
            this.instanceCounter.set(fileName, 0);
        } else {
            this.meshMap.delete(id);
            this.allInstances = this.allInstances.filter(instance => instance !== mesh);
            mesh.dispose();
        }
    }

    getTemplate(fileName: string): Mesh {
        return this.templatesByFileName.get(fileName);
    }

    getMesh(uniqueId: string): Mesh {
        return this.meshMap.get(uniqueId);
    }

    createInstance(meshObject: MeshObject, scene: Scene): void {
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
            this.addClone(clone.name, clone);
        }
        clone.setAbsolutePosition(new Vector3(0, 0, 0));
        clone.rotation = new Vector3(0, 0, 0);
        this.instanceCounter.set(meshObject.modelPath, counter + 1);
        
        meshObject.meshName = clone.name;

        const mesh =this.meshMap.get(meshObject.meshName);

        if (this.texturePathes.get(meshObject.modelPath)) {
            const texturePath = `${this.basePath}${MeshLoaderService.getFolderNameFromFileName(meshObject.modelPath)}/${this.texturePathes.get(meshObject.modelPath)}`;
            (<StandardMaterial> mesh.material).diffuseTexture  = new Texture(texturePath,  scene);
            (<StandardMaterial> mesh.material).specularTexture  = new Texture(texturePath,  scene);
            meshObject.texturePath = texturePath;
        }

        mesh.isVisible = true;
        const scale = meshObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.rotationQuaternion = undefined;

        const rect = <Rectangle> meshObject.dimensions;
        const width = rect.getWidth();
        const depth = rect.getHeight();

        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.rotation.y = meshObject.rotation;
    }

    clear(): void {
        // this.meshMap.forEach((mesh, key) => {
        //     this.gameFacade.scene.removeMesh(this.meshMap.get(key));
        //     this.meshMap.delete(key);
        // });

        this.allInstances.forEach(mesh => {
            mesh.dispose();
        })
        this.allInstances = [];
        this.meshMap = new Map();
        this.templates.clear();
        this.templatesByFileName = new Map();
    }
}