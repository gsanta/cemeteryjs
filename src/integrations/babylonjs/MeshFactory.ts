import { WorldItemInfo } from '../..';
import { Mesh, Skeleton, MeshBuilder, Scene, Vector3, StandardMaterial } from 'babylonjs';
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
    private map: Map<string, [Mesh[], Skeleton[]]> = new Map();
    private scene: Scene;
    private modelFileLoader: ModelFileLoader;
    private isReady = true;
    private modelFactory: ModelFactory;

    constructor(scene: Scene, modelFileLoader: ModelFileLoader, modelFactory: ModelFactory) {
        this.scene = scene;
        this.modelFileLoader = modelFileLoader;
        this.modelFactory = modelFactory;
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
        this.map.set(type, model);
    }

    getInstance(worldItemInfo: WorldItemInfo): Mesh {
        if (!this.isReady) {
            throw new Error('`MeshFactory` is not ready loading the models, please wait for the Promise returned from `loadModels` to resolve.');
        }

        const meshModel = this.map.get(worldItemInfo.type);

        switch(worldItemInfo.type) {
            case 'empty':
                return new EmptyAreaFactory(this.scene).createItem(worldItemInfo);
            case 'player':
                return new PlayerFactory().createItem(worldItemInfo, meshModel)
            case 'door':
                return new DoorFactory(this.scene, MeshBuilder).createItem(worldItemInfo, meshModel);
            case 'window':
                return new WindowFactory(this.scene, MeshBuilder).createItem(worldItemInfo, meshModel);
            case 'wall':
                return new WallFactory(this.scene).createItem(worldItemInfo);
            default:
                return this.modelFactory.createItem(worldItemInfo, meshModel);
        }
    }
}
