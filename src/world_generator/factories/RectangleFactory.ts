import { Axis, Mesh, MeshBuilder, Scene, Space, Vector3, Skeleton } from 'babylonjs';
import { GameObject } from '../services/GameObject';
import { MaterialFactory } from './MaterialFactory';
import { Polygon } from '../../model/geometry/shapes/Polygon';
import { Segment } from '../../model/geometry/shapes/Segment';
import { Rectangle } from '../../model/geometry/shapes/Rectangle';
import { GameFacade } from '../../game/GameFacade';

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

    createMesh(gameObject: GameObject): void {

        const rec = <Rectangle> gameObject.dimensions;
        const boundingInfo = gameObject.dimensions.getBoundingInfo();
        const width = boundingInfo.max[0] - boundingInfo.min[0];
        const depth = boundingInfo.max[1] - boundingInfo.min[1];

        const center = gameObject.dimensions.getBoundingCenter();
        const rect = <Rectangle> gameObject.dimensions;
        // const pivotPoint = new Vector3(rec.topLeft.x, 0, rec.topLeft.y);
        
        const mesh = MeshBuilder.CreateBox(
            `default-wall-container-${this.index}`,
            {
                width: rec.getWidth(),
                depth: rec.getHeight(),
                height: this.height
            },
            this.scene
        );

        this.gameFacade.meshStore.addClone(mesh.name, mesh);
        
        gameObject.meshName = mesh.name;

        const scale = gameObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        // mesh.setPivotPoint(pivotPoint);
        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);
        // mesh.rotate(Axis.Y, gameObject.rotation, Space.WORLD);

        mesh.material = this.materialFactory.createMaterial(gameObject);

        this.index++;

        mesh.computeWorldMatrix(true);
    }
}
