import { Color3, Mesh, MeshBuilder, Scene, Space, StandardMaterial, Vector3 } from 'babylonjs';
import { Registry } from '../../../editor/Registry';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MaterialBuilder } from './MaterialFactory';
import { MeshConcept } from '../../../editor/models/concepts/MeshConcept';

export class RectangleFactory  {
    private height: number;

    private registry: Registry;
    private materialBuilder: typeof MaterialBuilder;
    private materialIndex = 0;

    constructor(registry: Registry, height: number) {
        this.registry = registry;
        this.height = height;
        this.materialBuilder = MaterialBuilder;
    }

    createMesh2(scene: Scene, point: Point) {
        const mesh = MeshBuilder.CreateBox(
            'abcd',
            {
                width: 1,
                depth: 1,
                height: 1
            },
            scene
        );

        mesh.translate(new Vector3(point.x, 0, point.y), 1, Space.WORLD);

    }

    createMesh(meshObject: MeshConcept, scene: Scene): Mesh {
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

        const scale = meshObject.scale;
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
}
