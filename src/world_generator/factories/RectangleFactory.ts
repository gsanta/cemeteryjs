import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3 } from 'babylonjs';
import { GameObject } from '../services/GameObject';
import { MaterialFactory } from './MaterialFactory';
import { Polygon } from '../../model/geometry/shapes/Polygon';
import { Segment } from '../../model/geometry/shapes/Segment';

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

    createItem(gameObject: GameObject): Mesh {

        let width: number;
        let depth: number;

        // TODO: create different factory for Segment types, it should not be rectangle
        if (gameObject.dimensions instanceof Polygon) {
            const boundingInfo = gameObject.dimensions.getBoundingInfo();
            width = boundingInfo.max[0] - boundingInfo.min[0];
            depth = boundingInfo.max[1] - boundingInfo.min[1];
        } else {
            width = (<Segment> gameObject.dimensions).getLength();
            depth = gameObject.thickness;
            gameObject.dimensions = (<Segment> gameObject.dimensions).addThickness(0.25);
        }

        const parentMesh = MeshBuilder.CreateBox(
            `default-wall-container-${this.index}`,
            {
                width: width,
                depth: depth,
                height: this.height
            },
            this.scene
        );

        const center = gameObject.dimensions.getBoundingCenter();
        const pivotPoint = new Vector3(center.x, 0, center.y);
        parentMesh.setPivotPoint(pivotPoint);
        parentMesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);
        parentMesh.translate(new Vector3(center.x, this.height / 2, center.y), 1);

        parentMesh.material = this.materialFactory.createMaterial(gameObject);

        this.index++;

        parentMesh.computeWorldMatrix(true);
        return parentMesh;
    }
}
