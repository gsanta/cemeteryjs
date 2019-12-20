import { Color3, StandardMaterial, Texture } from 'babylonjs';
import { Scene } from "babylonjs/scene";
import { GameObject } from '../services/GameObject';
import { GameObjectTemplate } from '../services/GameObjectTemplate';

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

    createMaterial(worldItem: GameObject): StandardMaterial {
        return this.createSimpleMaterial(worldItem.color);
    }

    private createSimpleMaterial(material: string): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, this.scene);
        mat.diffuseColor = Color3.FromHexString(material);
        return mat;
    }
}