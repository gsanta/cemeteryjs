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

export class MeshFactoryProducer {

    private readonly FURNITURE_1_MATERIAL = 'models/furniture_1/material/beds.png';
    private readonly FURNITURE_1_BASE_PATH = 'models/furniture_1/';
    private readonly BED_MODEL_FILE = 'bed.babylon';

    private readonly FURNITURE_2_MATERIAL = 'models/furniture_2/material/furniture.png';
    private readonly FURITURE_2_BASE_PATH = 'models/furniture_2/';
    private readonly CUPBOARD_MODEL_FILE = 'cupboard.babylon';
    private readonly TABLE_MODEL_FILE = 'table.babylon';

    private readonly FURNITURE_3_MATERIAL = 'models/furniture_3/material/bathroom.png';
    private readonly FURITURE_3_BASE_PATH = 'models/furniture_3/';
    private readonly BATHTUB_MODEL_FILE = 'bathtub.babylon';
    private readonly WASHBASIN_MODEL_FILE = 'wash_basin.babylon';
    private readonly CHAIR_MODEL_FILE = 'chair.babylon';

    private readonly ENEMY_PATH = 'models/enemy/';
    private readonly GHOST_MODEL_FILE = 'ghost.obj';


    private readonly PLAYER_BASE_PATH = 'models/player/';
    private readonly PLAYER_MODEL_FILE = 'player.babylon';
    private readonly PLAYER_MATERIALS = [
        'models/player/material/0.jpg',
        'models/player/material/1.jpg',
        'models/player/material/2.jpg',
        'models/player/material/3.jpg'
    ];

    public getFactory(scene: Scene): Promise<MeshFactory> {

        return this.getMeshTemplateStore(scene)
            .then(meshTemplateStore => {

                const map: Map<string, MeshCreator> = new Map();
                map.set('bed', new ModelFactory(meshTemplateStore.get('bed'), scene));
                map.set('empty', new EmptyAreaFactory(scene));
                map.set('table', new ModelFactory(meshTemplateStore.get('table'), scene));
                map.set('cupboard', new ModelFactory(meshTemplateStore.get('cupboard'), scene));
                map.set('bathtub', new ModelFactory(meshTemplateStore.get('bathtub'), scene));
                map.set('washbasin', new ModelFactory(meshTemplateStore.get('washbasin'), scene));
                map.set('chair', new ModelFactory(meshTemplateStore.get('chair'), scene));
                map.set('player', new PlayerFactory(meshTemplateStore.get('player'), scene));
                map.set('door', new DoorFactory(meshTemplateStore.get('door'), scene, MeshBuilder));
                map.set('window', new WindowFactory(meshTemplateStore.get('window'), scene, MeshBuilder));
                map.set('wall', new WallFactory(scene));

                return new MeshFactory(map);
            });
    }

    protected getMeshTemplateStore(scene: Scene): Promise<Map<string, [Mesh[], Skeleton[]]>> {

        const modelFileLoader = new ModelFileLoader(scene);

        return Promise.all([
            modelFileLoader.load(
                'ghost',
                this.ENEMY_PATH,
                this.GHOST_MODEL_FILE,
                [],
                {...defaultMeshConfig, scaling: new Vector3(0.005, 0.005, 0.005)}
            ),
            modelFileLoader.load(
                'player',
                this.PLAYER_BASE_PATH,
                this.PLAYER_MODEL_FILE,
                this.PLAYER_MATERIALS,
                {...defaultMeshConfig, scaling: new Vector3(0.28, 0.28, 0.28)}
            ),
            modelFileLoader.load(
                'bed',
                this.FURNITURE_1_BASE_PATH,
                this.BED_MODEL_FILE,
                [this.FURNITURE_1_MATERIAL],
                {...defaultMeshConfig, scaling: new Vector3(0.03, 0.03, 0.03)}
            ),
            modelFileLoader.load(
                'window',
                'models/',
                'window.babylon',
                [],
                {...defaultMeshConfig, scaling: new Vector3(1, 1, 1)}
            ),
            modelFileLoader.load(
                'door',
                'models/',
                'door.babylon',
                [],
                {...defaultMeshConfig, scaling: new Vector3(1, 1, 1)}
            ),
            modelFileLoader.load(
                'table',
                this.FURITURE_2_BASE_PATH,
                this.TABLE_MODEL_FILE,
                [this.FURNITURE_2_MATERIAL],
                {...defaultMeshConfig, scaling: new Vector3(0.03, 0.03, 0.03)}
            ),
            modelFileLoader.load(
                'cupboard',
                this.FURITURE_2_BASE_PATH,
                this.CUPBOARD_MODEL_FILE,
                [this.FURNITURE_2_MATERIAL],
                {...defaultMeshConfig, scaling: new Vector3(0.03, 0.03, 0.03)}
            ),
            modelFileLoader.load(
                'bathtub',
                this.FURITURE_3_BASE_PATH,
                this.BATHTUB_MODEL_FILE,
                [this.FURNITURE_3_MATERIAL],
                {...defaultMeshConfig, scaling: new Vector3(3, 3, 3)}
            ),
            modelFileLoader.load(
                'washbasin',
                this.FURITURE_3_BASE_PATH,
                this.WASHBASIN_MODEL_FILE,
                [this.FURNITURE_3_MATERIAL],
                {...defaultMeshConfig, scaling: new Vector3(3, 3, 3)}
            ),
            modelFileLoader.load(
                'chair',
                this.FURITURE_3_BASE_PATH,
                this.CHAIR_MODEL_FILE,
                [this.FURNITURE_3_MATERIAL],
                {...defaultMeshConfig, scaling: new Vector3(3, 3, 3)}
            )
        ])
        .then((results: [Mesh[], Skeleton[]][]) => {
            const map = new Map<string, [Mesh[], Skeleton[]]>();

            results.forEach(model => map.set(model[0][0].name, model));

            return map;
        });
    }
}

