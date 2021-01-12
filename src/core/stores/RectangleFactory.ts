import { Color3, Mesh, MeshBuilder, Scene, Space, StandardMaterial, Vector3, Texture } from 'babylonjs';
import { toVector3 } from '../engine/adapters/babylonjs/Bab_Utils';
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
        const visibility = obj.getVisibility();

        const mesh = MeshBuilder.CreateBox(
            obj.id,
            {
                width: width,
                depth: depth,
                height: this.height
            },
            scene
        );
        mesh.checkCollisions = true;


        const scale = obj.getScale();
        mesh.scaling = new Vector3(scale.x, scale.x, scale.y);
        // mesh.translate(new Vector3(point.x + width / 2, 0, point.z - depth / 2), 1, Space.WORLD);
        mesh.translate(new Vector3(point.x, 0, point.z), 1, Space.WORLD);
        mesh.rotation = toVector3(obj.getRotation());

        mesh.material = this.createSimpleMaterial(scene, obj);

        mesh.computeWorldMatrix(true);
        mesh.visibility = visibility;

        return mesh;
    }

    
    private createSimpleMaterial(scene: Scene, obj: MeshObj | SpriteObj): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, scene);
        mat.diffuseColor = this.toColor3(obj.color);
        return mat;
    }

    private toColor3(color: string) {
        switch(color) {
            case 'green':
                return Color3.Green();
            case 'red':
                return Color3.Red();
            case 'blue':
                return Color3.Blue();
            case 'white':
                return Color3.White();
            case 'yellow':
                return Color3.Yellow();
            case 'black':
            case undefined:
                return Color3.White();
            default:
                return Color3.FromHexString(color);
        }
    }
}
