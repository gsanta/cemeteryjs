import { Color3, StandardMaterial, Texture } from 'babylonjs';
import { Scene } from "babylonjs/scene";
import { WorldItem } from '../../WorldItemInfo';
import { MeshDescriptor } from './MeshFactory';

export class MaterialBuilder {
    static CreateMaterial(name: string, scene: Scene): StandardMaterial {
        return new StandardMaterial(name, scene);
    }

    static CreateTexture(path: string, scene: Scene): Texture {
        return new Texture(path, scene);
    }
}

export class MaterialFactory {
    private scene: Scene;
    private materialBuilder: typeof MaterialBuilder;
    private materialIndex = 1;

    constructor(scene: Scene, materialBuilder: typeof MaterialBuilder = MaterialBuilder) {
        this.scene = scene;
        this.materialBuilder = materialBuilder;
    }

    createMaterial(worldItem: WorldItem, meshDescriptor: MeshDescriptor): StandardMaterial {
        if (meshDescriptor.conditionalMaterials) {
            return this.createConditionalMaterials(worldItem, meshDescriptor);
        } else {
            return this.createSimpleMaterial(meshDescriptor.materials[0]);
        }
    }

    private createConditionalMaterials(worldItem: WorldItem, meshDescriptor: MeshDescriptor) {
        const conditionalMaterial = meshDescriptor.conditionalMaterials.find(condMat => worldItem.rooms.find(room => room.id === condMat.parentId));

        if (conditionalMaterial) {
            const mat = this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, this.scene);

            if (conditionalMaterial.path) {
                mat.diffuseTexture = this.materialBuilder.CreateTexture(conditionalMaterial.path, this.scene);
            } else {
                mat.diffuseColor = Color3.FromHexString(conditionalMaterial.color);
            }
            return mat;
        } else {
            return this.createSimpleMaterial(meshDescriptor.materials[0]);
        }
    }

    private createSimpleMaterial(material: string): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, this.scene);
        mat.diffuseColor = Color3.FromHexString(material);
        return mat;
    }
}