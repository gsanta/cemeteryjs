import { Shape } from '@nightshifts.inc/geometry';
import { Scene } from 'babylonjs';
import { WorldGeneratorServices } from '../src/model/services/WorldGeneratorServices';
import { TreeIteratorGenerator } from '../src/model/utils/TreeIteratorGenerator';
import { FileFormat } from '../src/WorldGenerator';
import { GameObject } from '../src/model/types/GameObject';
import { FakeModelLoader } from './fakes/FakeModelLoader';
import { FakeCreateMeshModifier } from './fakes/FakeCreateMeshModifier';
import { GameAssetStore } from '../src/model/services/GameAssetStore';


/**
 * @deprecated use setupTestEnv
 */
export function setup(worldMap: string, fileFormat: FileFormat): WorldGeneratorServices {
    const services = new WorldGeneratorServices(
        null,
        new FakeCreateMeshModifier(),
        fileFormat

    );

    const {gameObjectTemplates, globalConfig} = services.generateMetaData(worldMap);
    services.gameAssetStore = new GameAssetStore(gameObjectTemplates, globalConfig);

    return services;
}

export function setupTestEnv(worldMap: string, fileFormat: FileFormat, fakeModelImporter?: FakeModelLoader): WorldGeneratorServices {
    const services = new WorldGeneratorServices(
        fakeModelImporter ? fakeModelImporter : new FakeModelLoader(new Map()),
        new FakeCreateMeshModifier(),        
        fileFormat
    );
    const {gameObjectTemplates, globalConfig} = services.generateMetaData(worldMap);
    services.gameAssetStore = new GameAssetStore(gameObjectTemplates, globalConfig);

    services.gameAssetStore.gameObjects = services.gameObjectBuilder.build(worldMap);

    return services;
}

export function setupMap(map: string): string {
    return `
    map \`

    ${map}

    \`

    definitions \`

    W = wall ROLES [BORDER]
    D = door ROLES [BORDER]
    I = window ROLES [BORDER]
    - = room ROLES [CONTAINER]
    E = bed  MOD assets/models/bed.babylon
    T = table DIM 2 1 MOD assets/models/table.babylon
    = = _subarea ROLES [CONTAINER]
    H = chair
    C = cupboard DIM 0.5 2 MOD assets/models/cupboard.babylon

    \`
`;
}

export function createScene(): Scene {
    return <Scene>{

    };
}

export abstract class MeshBuilderStubs {
    static CreateDisc: sinon.SinonStub;
}

export abstract class MaterialBuilderStubs {
    static CreateMaterial: sinon.SinonStub;
    static CreateTexture: sinon.SinonStub;
}

export function findWorldItemWithDimensions(worldItems: GameObject[], dimensions: Shape): GameObject {

    for (let i = 0; i < worldItems.length; i++) {
        for (const item of TreeIteratorGenerator(worldItems[i])) {
            if (item.dimensions.equalTo(dimensions)) {
                return item;
            }
        }
    }
}
