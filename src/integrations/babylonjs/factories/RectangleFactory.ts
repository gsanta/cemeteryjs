import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { MaterialFactory } from '../MaterialFactory';
import { MeshDescriptor } from '../../../Config';
import { Polygon } from '@nightshifts.inc/geometry';

export class RectangleFactory  {
    private materialFactory: MaterialFactory;
    private scene: Scene;
    private index = 1;

    constructor(scene: Scene, materialFactory: MaterialFactory) {
        this.scene = scene;
        this.materialFactory = materialFactory;
    }

    createItem(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor): Mesh {

        let width: number;
        let depth: number;

        // TODO: create different factory for Segment types, it should not be rectangle
        if (worldItemInfo.dimensions instanceof Polygon) {
            const boundingInfo = worldItemInfo.dimensions.getBoundingInfo();
            width = boundingInfo.max[0] - boundingInfo.min[0];
            depth = boundingInfo.max[1] - boundingInfo.min[1];
        } else {
            width = (<Segment> worldItemInfo.dimensions).getLength();
            depth = worldItemInfo.thickness;
            worldItemInfo.dimensions = (<Segment> worldItemInfo.dimensions).addThickness(0.25);
        }

        const parentMesh = MeshBuilder.CreateBox(
            `default-wall-container-${this.index}`,
            {
                width: width,
                depth: depth,
                height: 7.2
            },
            this.scene
        );

        const center = worldItemInfo.dimensions.getBoundingCenter();
        const pivotPoint = new Vector3(center.x, 0, center.y);
        parentMesh.setPivotPoint(pivotPoint);
        parentMesh.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);
        parentMesh.translate(new Vector3(center.x, 3.6, center.y), 1);

        parentMesh.material = this.materialFactory.createMaterial(worldItemInfo, meshDescriptor);

        this.index++;

        parentMesh.computeWorldMatrix(true);
        return parentMesh;
    }
}
