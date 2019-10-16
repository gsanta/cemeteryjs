import { Shape } from '@nightshifts.inc/geometry';
import { Scene } from 'babylonjs';
import { MockMeshTemplateService } from '../../src/integrations/mock/MockWorldGenerator';
import { ConfigService } from '../../src/model/services/ConfigService';
import { ServiceFacade } from '../../src/model/services/ServiceFacade';
import { TreeIteratorGenerator } from '../../src/model/utils/TreeIteratorGenerator';
import { WorldItem } from '../../src/WorldItem';
import { TestMeshFactoryService } from '../setup/TestMeshFactoryService';
import { GlobalsSectionParser } from '../../src/model/parsers/GlobalSectionParser';

export function setup(worldMap: string): ServiceFacade<any, any, any> {

    const meshFactoryService = new TestMeshFactoryService();

    const configService = new ConfigService().update(worldMap);
    configService.globalConfig = new GlobalsSectionParser().parse(worldMap);

    const mockMeshTemplateService = new MockMeshTemplateService(configService.meshDescriptorMap);

    return new ServiceFacade<any, any, any>(
        meshFactoryService,
        mockMeshTemplateService,
        configService
    );
}

export function setupMap(map: string): string {
    return `
    map \`

    ${map}

    \`

    definitions \`

    W = wall BORDER
    D = door BORDER
    I = window BORDER
    - = room
    E = bed
    T = table DIM 2 1 MOD assets/models/table.babylon
    = = _subarea
    H = chair
    C = cupboard DIM 0.5 2 MOD assets/models/cupboard.babylon
    B = bed MOD assets/models/bed.babylon

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
