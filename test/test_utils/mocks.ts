import { Shape, Point } from '@nightshifts.inc/geometry';
import { MeshBuilder, Scene } from 'babylonjs';
import * as sinon from 'sinon';
import { MaterialBuilder } from '../../src/integrations/babylonjs/MaterialFactory';
import { ConfigService } from '../../src/model/services/ConfigService';
import { ServiceFacade } from '../../src/model/services/ServiceFacade';
import { TreeIteratorGenerator } from '../../src/model/utils/TreeIteratorGenerator';
import { WorldItem } from '../../src/WorldItem';
import { TestMeshFactoryService } from '../setup/TestMeshFactoryService';
import { MeshDescriptor } from '../../src/Config';
import { MockMeshTemplateService } from '../../src/integrations/mock/MockWorldGenerator';

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

    \`
`;
}

export function createScene(): Scene {
    return <Scene> {

    };
}

export abstract class MeshBuilderStubs {
    static CreateDisc: sinon.SinonStub;
}

export function createMeshBuilder(): [typeof MeshBuilder, typeof MeshBuilderStubs] {
    const CreateDisc = sinon.stub();

    CreateDisc.returns({
        name: 'Disc',
        translate: sinon.stub()
    });
    return [
        <typeof MeshBuilder> {
            CreateDisc: (<any> CreateDisc)
        },
        <typeof MeshBuilderStubs> {
            CreateDisc
        }
    ];
}

export abstract class MaterialBuilderStubs {
    static CreateMaterial: sinon.SinonStub;
    static CreateTexture: sinon.SinonStub;
}

export function createMaterialBuilder(): [typeof MaterialBuilder, typeof MaterialBuilderStubs] {
    const CreateMaterial = sinon.stub();

    CreateMaterial.callsFake((name: string) => {
        return {
            name
        }
    });

    const CreateTexture = sinon.stub();

    CreateTexture.callsFake((url: string) => {
        return {
            url
        }
    });

    return [
        <typeof MaterialBuilder> {
            CreateMaterial: (<any> CreateMaterial),
            CreateTexture: (<any> CreateTexture)
        },
        <typeof MaterialBuilderStubs> {
            CreateMaterial,
            CreateTexture
        }
    ]
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
