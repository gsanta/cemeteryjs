import { MeshBuilder, Space, Vector3, Mesh } from 'babylonjs';
import { ServiceLocator } from '../../../editor/services/ServiceLocator';
import { Stores } from '../../../editor/stores/Stores';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MeshObject } from '../../models/objects/MeshObject';
import { MaterialFactory } from './MaterialFactory';

export class RectangleFactory  {
    private height: number;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;
    private materialFactory: MaterialFactory;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores, height: number) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.height = height;
        this.materialFactory = new MaterialFactory(this.getServices().gameService().gameEngine.scene);
    }

    createMesh(meshObject: MeshObject): Mesh {
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
            this.getServices().gameService().gameEngine.scene
        );

        meshObject.meshName = mesh.name;

        const scale = meshObject.scale;
        mesh.scaling = new Vector3(scale, scale, scale);
        mesh.translate(new Vector3(rect.topLeft.x + width / 2, 0, -rect.topLeft.y - depth / 2), 1, Space.WORLD);

        mesh.material = this.materialFactory.createMaterial(meshObject);

        mesh.computeWorldMatrix(true);

        return mesh;
    }
}
