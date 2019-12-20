import { Color3, Mesh, PolygonMeshBuilder, Scene, StandardMaterial, Vector2 } from 'babylonjs';
import { GameObject } from '../services/GameObject';
import { Polygon } from '../../model/geometry/shapes/Polygon';
import { Segment } from '../../model/geometry/shapes/Segment';

export class PolygonFactory  {
    private scene: Scene;
    private index = 1;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createMesh(worldItemInfo: GameObject): Mesh {

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

        if (worldItemInfo.color) {
            const material = new StandardMaterial('box-material', this.scene);
            material.diffuseColor = Color3.FromHexString(worldItemInfo.color);
            parentMesh.material = material;
        }

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
