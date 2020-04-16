import { Color3, Mesh, MeshBuilder, Scene, Space, StandardMaterial, Vector3 } from 'babylonjs';
import { Stores } from '../../../editor/stores/Stores';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MeshObject } from '../../models/objects/MeshObject';
import { MaterialBuilder } from './MaterialFactory';

export class RectangleFactory  {
    private height: number;

    private getStores: () => Stores;
    private materialBuilder: typeof MaterialBuilder;
    private materialIndex = 0;

    constructor(getStores: () => Stores, height: number) {
        this.getStores = getStores;
        this.height = height;
        this.materialBuilder = MaterialBuilder;
    }

    createMesh(meshObject: MeshObject, scene: Scene): Mesh {
        const rec = <Rectangle> meshObject.dimensions;
        const boundingInfo = meshObject.dimensions.getBoundingInfo();
        const width = boundingInfo.max[0] - boundingInfo.min[0];
        const depth = boundingInfo.max[1] - boundingInfo.min[1];

        const rect = <Rectangle> meshObject.dimensions;
        
        const mesh = MeshBuilder.CreateBox(
            meshObject.id,
            {
                width: rec.getWidth(),
                depth: rec.getHeight(),
                height: this.height
            },
            scene
        );

        meshObject.setMesh(mesh);

        meshObject.meshName = mesh.name;

        const scale = meshObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.material = this.createSimpleMaterial(meshObject.color, scene);

        mesh.computeWorldMatrix(true);

        return mesh;
    }

    
    private createSimpleMaterial(color: string, scene: Scene): StandardMaterial {
        const mat =  this.materialBuilder.CreateMaterial(`${this.materialIndex++}`, scene);
        mat.diffuseColor = Color3.FromHexString(color);
        return mat;
    }
}
