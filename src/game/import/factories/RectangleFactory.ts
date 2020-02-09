import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3, Skeleton } from 'babylonjs';
import { MeshView } from '../../../common/views/MeshView';
import { MaterialFactory } from './MaterialFactory';
import { Polygon } from '../../../misc/geometry/shapes/Polygon';
import { Segment } from '../../../misc/geometry/shapes/Segment';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { GameFacade } from '../../GameFacade';
import { MeshObject } from '../../models/objects/MeshObject';

export class RectangleFactory  {
    private gameFacade: GameFacade;
    private materialFactory: MaterialFactory;
    private scene: Scene;
    private index = 1;
    private height: number;

    constructor(scene: Scene, materialFactory: MaterialFactory, gameFacade: GameFacade, height: number) {
        this.gameFacade = gameFacade;
        this.scene = scene;
        this.materialFactory = materialFactory;
        this.height = height;
    }

    createMesh(meshObject: MeshObject): void {

        const rec = <Rectangle> meshObject.dimensions;
        const boundingInfo = meshObject.dimensions.getBoundingInfo();
        const width = boundingInfo.max[0] - boundingInfo.min[0];
        const depth = boundingInfo.max[1] - boundingInfo.min[1];

        const center = meshObject.dimensions.getBoundingCenter();
        const rect = <Rectangle> meshObject.dimensions;
        // const pivotPoint = new Vector3(rec.topLeft.x, 0, rec.topLeft.y);
        
        const mesh = MeshBuilder.CreateBox(
            meshObject.name,
            {
                width: rec.getWidth(),
                depth: rec.getHeight(),
                height: this.height
            },
            this.scene
        );

        this.gameFacade.meshStore.addMesh(meshObject.name, mesh);
        
        meshObject.meshName = mesh.name;

        const scale = meshObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        // mesh.setPivotPoint(pivotPoint);
        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);
        // mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);

        mesh.material = this.materialFactory.createMaterial(meshObject);

        this.index++;

        mesh.computeWorldMatrix(true);
    }
}
