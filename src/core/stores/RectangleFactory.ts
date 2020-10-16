import { Color3, Mesh, MeshBuilder, Scene, Space, StandardMaterial, Vector3, Texture } from 'babylonjs';
import { MeshObj } from '../models/objs/MeshObj';
import { SpriteObj } from '../models/objs/SpriteObj';

export class MaterialBuilder {
    static CreateMaterial(name: string, scene: Scene): StandardMaterial {
        return new StandardMaterial(name, scene);
    }

    static CreateTexture(path: string, scene: Scene): Texture {
        return new Texture(path, scene);
    }
}

export class RectangleFactory  {
    private height: number;

    private materialBuilder: typeof MaterialBuilder;
    private materialIndex = 0;
    private color: string;

    constructor(height: number, color: string) {
        this.height = height;
        this.color = color;
        this.materialBuilder = MaterialBuilder;
    }

    createMesh(obj: MeshObj | SpriteObj, scene: Scene): Mesh {
        const point = obj.getPosition();
        const width = 10;
        const depth = 10;

        const mesh = MeshBuilder.CreateBox(
            obj.id,
            {
                width: width,
                depth: depth,
                height: this.height
            },
            scene
        );


        const scale = obj.getScale();
        mesh.scaling = new Vector3(scale.x, scale.x, scale.y);
        mesh.translate(new Vector3(point.x + width / 2, 0, point.z - depth / 2), 1, Space.WORLD);

        mesh.material = this.createSimpleMaterial(scene);

        mesh.computeWorldMatrix(true);

        return mesh;
    }

    
    private createSimpleMaterial(scene: Scene): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, scene);
        mat.diffuseColor = Color3.FromHexString(this.color);
        return mat;
    }
}
