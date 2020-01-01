import { Scene, Mesh } from 'babylonjs';
import { WorldGeneratorServices } from '../src/world_generator/services/WorldGeneratorServices';
import { TreeIteratorGenerator } from '../src/world_generator/utils/TreeIteratorGenerator';
import { GameObject } from '../src/world_generator/services/GameObject';
import { FakeModelLoader } from './fakes/FakeModelLoader';
import { FakeCreateMeshModifier } from './fakes/FakeCreateMeshModifier';
import { GameObjectStore } from '../src/game/models/GameObjectStore';
import { Shape } from '../src/model/geometry/shapes/Shape';
import { GameFacade } from '../src/game/GameFacade';


/**
 * @deprecated use setupTestEnv
 */
export function setup(worldMap: string): WorldGeneratorServices<Mesh> {

    const services = new WorldGeneratorServices<Mesh>(
        new GameFacade(null),
        null,
        new FakeCreateMeshModifier()
    );

    const {globalConfig} = services.generateMetaData(worldMap);
    services.worldFacade.gameObjectStore.globalConfig = globalConfig;

    return services;
}

export function setupTestEnv(worldMap: string, fakeModelImporter?: FakeModelLoader): WorldGeneratorServices<Mesh> {
    const services = new WorldGeneratorServices(
        new GameFacade(null),
        fakeModelImporter ? fakeModelImporter : new FakeModelLoader(new Map()),
        new FakeCreateMeshModifier()
    );
    const {globalConfig} = services.generateMetaData(worldMap);
    services.worldFacade.gameObjectStore.globalConfig = globalConfig;

    services.worldFacade.gameObjectStore.gameObjects = services.gameObjectBuilder.build(worldMap);

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
