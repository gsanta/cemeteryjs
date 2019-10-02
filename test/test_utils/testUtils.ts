import { Shape } from '@nightshifts.inc/geometry';
import { Scene } from 'babylonjs';
import { MeshDescriptor } from '../../src/Config';
import { MockMeshTemplateService } from '../../src/integrations/mock/MockWorldGenerator';
import { ConfigService } from '../../src/model/services/ConfigService';
import { ServiceFacade } from '../../src/model/services/ServiceFacade';
import { TreeIteratorGenerator } from '../../src/model/utils/TreeIteratorGenerator';
import { WorldItem } from '../../src/WorldItem';
import { TestMeshFactoryService } from '../setup/TestMeshFactoryService';

export function setup(worldMap: string, meshDescriptors: MeshDescriptor[]): ServiceFacade<any, any, any> {

    const meshFactoryService = new TestMeshFactoryService();

    const templateMap: Map<string, MeshDescriptor> = new Map();
    meshDescriptors.map(descriptor => templateMap.set(descriptor.type, descriptor));
    const mockMeshTemplateService = new MockMeshTemplateService(templateMap);

    const meshDescriptorMap: Map<string, MeshDescriptor<any>> = new Map();
    meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));

    const configService = new ConfigService(worldMap, meshDescriptorMap);

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

    W = wall
    D = door
    I = window
    - = empty
    E = bed
    T = table
    = = _subarea
    H = chair

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
