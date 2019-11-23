import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3, PolygonMeshBuilder, Vector2 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { MaterialFactory } from '../MaterialFactory';
import { WorldItemDefinition } from '../../../WorldItemDefinition';
import { Polygon } from '@nightshifts.inc/geometry';

export class PolygonFactory  {
    private materialFactory: MaterialFactory;
    private scene: Scene;
    private index = 1;

    constructor(scene: Scene, materialFactory: MaterialFactory) {
        this.scene = scene;
        this.materialFactory = materialFactory;
    }

    createItem(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition): Mesh {

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

        const points = worldItemInfo.dimensions.getPoints().reverse().map(point => new Vector2(point.x, point.y));

        const parentMesh = new PolygonMeshBuilder('polygon', points, this.scene).build(null, 8);

        // const parentMesh = MeshBuilder.CreateBox(
        //     `default-wall-container-${this.index}`,
        //     {
        //         width: width,
        //         depth: depth,
        //         height: 7.2
        //     },
        //     this.scene
        // );

        // const center = worldItemInfo.dimensions.getBoundingCenter();
        // const pivotPoint = new Vector3(center.x, 0, center.y);
        // parentMesh.setPivotPoint(pivotPoint);
        // parentMesh.rotate(Axis.Y, worldItemInfo.rotation, Space.WORLD);
        // parentMesh.translate(new Vector3(center.x, 3.6, center.y), 1);

        // parentMesh.material = this.materialFactory.createMaterial(worldItemInfo, meshDescriptor);

        // this.index++;

        // parentMesh.computeWorldMatrix(true);
        return parentMesh;
    }
}
