import { MeshCreator } from './MeshCreator';
import { WorldItemInfo } from '../..';
import { Mesh, Skeleton, MeshBuilder, Scene, Vector3, StandardMaterial } from '@babylonjs/core';
import { EmptyAreaFactory } from './factories/EmptyAreaFactory';
import { PlayerFactory } from './factories/PlayerFactory';
import { DoorFactory } from './factories/DoorFactory';
import { WindowFactory } from './factories/WindowFactory';
import { WallFactory } from './factories/WallFactory';
import { ModelFactory } from './factories/ModelFactory';
import { ModelFileLoader } from './ModelFileLoader';

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

export class MeshFactory {
    private map: Map<string, MeshCreator> = new Map();
    private scene: Scene;
    private modelFileLoader: ModelFileLoader;
    private isReady = true;

    constructor(scene: Scene, modelFileLoader: ModelFileLoader) {
        this.scene = scene;
        this.modelFileLoader = modelFileLoader;
    }

    loadModels(modelTypeDescription: ModelTypeDescription[]): Promise<void> {
        this.isReady = false;
        const promises = modelTypeDescription.map(
            desc => this.modelFileLoader.load(
                desc.type,
                desc.fileDescription.path,
                desc.fileDescription.fileName,
                [],
                {...defaultMeshConfig, scaling: new Vector3(desc.fileDescription.scale, desc.fileDescription.scale, desc.fileDescription.scale)}
            )
        );
        return Promise.all(promises)
            .then((results: [Mesh[], Skeleton[], string][]) => {
                results.forEach(model => this.registerMeshCreator(model[2], [model[0], model[1]]));

                this.isReady = true;
            });
    }

    private registerMeshCreator(type: string, model: [Mesh[], Skeleton[]]) {
        switch(type) {
            case 'empty':
                this.map.set('empty', new EmptyAreaFactory(this.scene));
                break;
            case 'player':
                this.map.set('player', new PlayerFactory(model, this.scene));
                break;
            case 'door':
                this.map.set('door', new DoorFactory(model, this.scene, MeshBuilder));
                break;
            case 'window':
                this.map.set('window', new WindowFactory(model, this.scene, MeshBuilder));
                break;
            case 'wall':
                this.map.set('wall', new WallFactory(this.scene));
                break;
            default:
                this.map.set(type, new ModelFactory(model, this.scene));
                break;
        }
    }

    getInstance(worldItemInfo: WorldItemInfo): Mesh {
        if (!this.isReady) {
            throw new Error('`MeshFactory` is not ready loading the models, please wait for the Promise returned from `loadModels` to resolve.');
        }

        const worldItemFactory = this.map.get(worldItemInfo.type);
        return worldItemFactory.createItem(worldItemInfo);
    }
}
