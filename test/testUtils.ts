import { Shape } from '@nightshifts.inc/geometry';
import { Scene } from 'babylonjs';
import { ServiceFacade } from '../src/model/services/ServiceFacade';
import { TreeIteratorGenerator } from '../src/model/utils/TreeIteratorGenerator';
import { FileFormat } from '../src/WorldGenerator';
import { WorldItem } from '../src/WorldItem';
import { FakeModelImporterService } from './fakes/FakeModelImporterService';
import { FakeCreateMeshModifier } from './fakes/FakeCreateMeshModifier';


/**
 * @deprecated use setupTestEnv
 */
export function setup(worldMap: string, fileFormat: FileFormat): ServiceFacade<any, any, any> {

    const serviceFacade = new ServiceFacade<any, any, any>(
        null,
        new FakeCreateMeshModifier(),
        fileFormat
    );
    serviceFacade.configService.update(worldMap);

    return serviceFacade;
}

export function setupTestEnv(worldMap: string, fileFormat: FileFormat, fakeModelImporter?: FakeModelImporterService): ServiceFacade<any, any, any> {
    const services = new ServiceFacade<any, any, any>(
        fakeModelImporter ? fakeModelImporter : new FakeModelImporterService(new Map()),
        new FakeCreateMeshModifier(),
        fileFormat
    );
    services.configService.update(worldMap);

    services.configService.worldItemHierarchy = services.worldItemBuilderService.build(worldMap);

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

export function findWorldItemWithDimensions(worldItems: WorldItem[], dimensions: Shape): WorldItem {

    for (let i = 0; i < worldItems.length; i++) {
        for (const item of TreeIteratorGenerator(worldItems[i])) {
            if (item.dimensions.equalTo(dimensions)) {
                return item;
            }
        }
    }
}
