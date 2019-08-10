import { Scene } from "babylonjs/scene";
import { StandardMaterial } from "babylonjs";


export class MaterialBuilder {

    public static CreateMaterial(name: string, scene: Scene) {
        return new StandardMaterial(name, scene);
    }
}