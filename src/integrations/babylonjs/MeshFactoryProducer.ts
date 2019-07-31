import { Mesh, Scene, Skeleton, MeshBuilder, Vector3, StandardMaterial } from '@babylonjs/core';
import { ModelFactory } from './factories/ModelFactory';
import { PlayerFactory } from './factories/PlayerFactory';
import { DoorFactory } from './factories/DoorFactory';
import { WindowFactory } from './factories/WindowFactory';
import { ModelFileLoader } from './ModelFileLoader';
import { MeshCreator } from './MeshCreator';
import { MeshFactory } from './MeshFactory';
import { EmptyAreaFactory } from './factories/EmptyAreaFactory';
import { WallFactory } from './factories/WallFactory';

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

export interface ModelTypeDescription {
    type: string;
    model: 'file' | 'rectangle';
    fileDescription: {
        path: string;
        fileName: string;
        scale: number
    }
}

export class MeshFactoryProducer {
    public getFactory(scene: Scene, modelTypeDescription: ModelTypeDescription[]): Promise<MeshFactory> {
        return this.loadModels(scene, modelTypeDescription)
            .then(modelStore => {
                const map: Map<string, MeshCreator> = new Map();

                modelStore.forEach((model, type) => {
                    // TODO: get rid of hardcoded types
                    switch(type) {
                        case 'empty':
                            map.set('empty', new EmptyAreaFactory(scene));
                            break;
                        case 'player':
                            map.set('player', new PlayerFactory(model, scene));
                            break;
                        case 'door':
                            map.set('door', new DoorFactory(model, scene, MeshBuilder));
                            break;
                        case 'window':
                            map.set('window', new WindowFactory(model, scene, MeshBuilder));
                            break;
                        case 'wall':
                            map.set('wall', new WallFactory(scene));
                            break;
                        default:
                            map.set(type, new ModelFactory(model, scene));
                            break;
                    }
                });

                return new MeshFactory(map);
            });
    }

    private loadModels(scene: Scene, modelTypeDescription: ModelTypeDescription[]): Promise<Map<string, [Mesh[], Skeleton[]]>> {
        const modelFileLoader = new ModelFileLoader(scene);

        const promises = modelTypeDescription.map(
            desc => modelFileLoader.load(
                desc.type,
                desc.fileDescription.path,
                desc.fileDescription.fileName,
                [],
                {...defaultMeshConfig, scaling: new Vector3(desc.fileDescription.scale, desc.fileDescription.scale, desc.fileDescription.scale)}
            )
        );
        return Promise.all(promises)
            .then((results: [Mesh[], Skeleton[]][]) => {
                const map = new Map<string, [Mesh[], Skeleton[]]>();

                results.forEach(model => map.set(model[0][0].name, model));

                return map;
            });
    }
}

