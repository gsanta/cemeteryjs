
import { Mesh, Scene, StandardMaterial, Vector3 } from 'babylonjs';
import { WorldItem } from '../..';
import { WorldItemDefinition } from '../../WorldItemDefinition';
import { WorldItemShape } from '../../WorldItem';
import { PolygonFactory } from '../../integrations/babylonjs/factories/PolygonFactory';
import { MaterialFactory } from '../../integrations/babylonjs/MaterialFactory';

export interface MeshTemplateConfig {
    checkCollisions: boolean;
    receiveShadows: boolean;
    isPickable: boolean;
    scaling: Vector3;
    singleton: boolean;

    materials: {
        default: StandardMaterial;
        dark: StandardMaterial;
    };
}

export const defaultMeshConfig: MeshTemplateConfig = {
    checkCollisions: true,
    receiveShadows: true,
    isPickable: true,
    scaling: new Vector3(1, 1, 1),
    singleton: false,

    materials: null
};

export class MeshFactoryService {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(worldItem: WorldItem, meshDescriptor: WorldItemDefinition): Promise<void> {
        return this.createMesh(worldItem, meshDescriptor).then(mesh => {worldItem.meshTemplate.meshes = [mesh]});
    }

    private createMesh(worldItem: WorldItem, meshDescriptor: WorldItemDefinition): Promise<Mesh> {
        switch(worldItem.shape) {
            case WorldItemShape.RECTANGLE:
                return new PolygonFactory(this.scene, new MaterialFactory(this.scene)).createItem(worldItem, meshDescriptor);
            case WorldItemShape.MODEL:
                return new PolygonFactory(this.scene, new MaterialFactory(this.scene)).createItem(worldItem, meshDescriptor);
        }
    }
}
