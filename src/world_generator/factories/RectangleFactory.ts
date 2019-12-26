import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3 } from 'babylonjs';
import { GameObject } from '../services/GameObject';
import { MaterialFactory } from './MaterialFactory';
import { Polygon } from '../../model/geometry/shapes/Polygon';
import { Segment } from '../../model/geometry/shapes/Segment';
import { Rectangle } from '../../model/geometry/shapes/Rectangle';

export class RectangleFactory  {
    private materialFactory: MaterialFactory;
    private scene: Scene;
    private index = 1;
    private height: number;

    constructor(scene: Scene, materialFactory: MaterialFactory, height: number) {
        this.scene = scene;
        this.materialFactory = materialFactory;
        this.height = height;
    }

    createMesh(gameObject: GameObject): Mesh {
        const boundingInfo = gameObject.dimensions.getBoundingInfo();
        const width = boundingInfo.max[0] - boundingInfo.min[0];
        const depth = boundingInfo.max[1] - boundingInfo.min[1];

        const center = gameObject.dimensions.getBoundingCenter();
        const rect = <Rectangle> gameObject.dimensions;
        const pivotPoint = new Vector3(center.x, 0, center.y);
        
        const mesh = MeshBuilder.CreateBox(
            `default-wall-container-${this.index}`,
            {
                width: width,
                depth: depth,
                height: this.height
            },
            this.scene
        );

        mesh.translate(new Vector3(rect.topLeft.x, 0, -rect.topLeft.y), 1, Space.WORLD);
        mesh.setPivotPoint(pivotPoint);
        mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);

        mesh.material = this.materialFactory.createMaterial(gameObject);

        this.index++;

        mesh.computeWorldMatrix(true);
        return mesh;
    }
}
