import { Color3, Mesh, MeshBuilder, Scene, Space, StandardMaterial, Vector3, Texture } from 'babylonjs';
import { Registry } from '../Registry';
import { Point } from '../geometry/shapes/Point';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { MeshView } from './views/MeshView';

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

    constructor(height: number) {
        this.height = height;
        this.materialBuilder = MaterialBuilder;
    }

    createMesh(meshObject: MeshView, scene: Scene): Mesh {
        const rec = <Rectangle> meshObject.dimensions.div(10);
        const boundingInfo = rec.getBoundingInfo();
        const width = boundingInfo.max[0] - boundingInfo.min[0];
        const depth = boundingInfo.max[1] - boundingInfo.min[1];

        const mesh = MeshBuilder.CreateBox(
            meshObject.id,
            {
                width: rec.getWidth(),
                depth: rec.getHeight(),
                height: this.height
            },
            scene
        );

        meshObject.mesh = mesh;

        meshObject.meshName = mesh.name;

        const scale = meshObject.getScale();
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.translate(new Vector3(rec.topLeft.x + width / 2, 0, -rec.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.material = this.createSimpleMaterial(meshObject.color, scene);

        mesh.computeWorldMatrix(true);

        return mesh;
    }

    
    private createSimpleMaterial(color: string, scene: Scene): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, scene);
        mat.diffuseColor = Color3.FromHexString(color);
        return mat;
    }

    createMaterial(meshObject: MeshView, scene: Scene): StandardMaterial {
        return this.createSimpleMaterial(meshObject.color, scene);
    }
}
