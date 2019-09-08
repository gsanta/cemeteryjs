import { Scene } from 'babylonjs/scene';
import { WorldGenerator, Converter } from '../../WorldGenerator';
import { MeshDescriptor } from '../../Config';
import { WorldConfig } from '../../services/ImporterService';
import { ConfigService } from '../../services/ConfigService';
import { ServiceFacade } from '../../services/ServiceFacade';
import { MeshFactoryService } from '../../services/MeshFactoryService';
import { WorldItem } from '../../WorldItem';
import { MeshTemplate } from '../../MeshTemplate';
import { MeshTemplateService } from '../../services/MeshTemplateService';
import { Point } from '@nightshifts.inc/geometry';

export class MockMeshFactoryService implements MeshFactoryService<any, any> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<any, any>>): any {
        return null
    }
}

export class MockMeshTemplateService implements MeshTemplateService<any, any> {

    meshTemplates: Map<string, MeshTemplate<any, any>> = new Map();
    hasTemplate(type: string): boolean {
        return false;
    }
    getTemplateDimensions(type: string): Point {
        return null;
    }

    loadAll(meshDescriptors: MeshDescriptor[]): Promise<unknown> {
        return Promise.resolve();
    }
}


export class MockWorldGenerator<T> implements WorldGenerator<T> {
    generate(worldMap: string, worldConfig: WorldConfig, converter: Converter<T>) {
        const meshDescriptorMap: Map<string, MeshDescriptor<any>> = new Map();
        worldConfig.meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));

        const meshFactoryService = new MockMeshFactoryService();
        const meshTemplateService = new MockMeshTemplateService();

        const configService = new ConfigService(worldConfig.borders, worldConfig.furnitures, meshDescriptorMap, {x: worldConfig.xScale, y: worldConfig.yScale})

        const serviceFacade = new ServiceFacade<any, any, T>(
            meshFactoryService,
            meshTemplateService,
            configService
        );

        const worldItems = serviceFacade.importerService.import(worldMap);

        serviceFacade.converterService.convert(worldItems, converter);
    }
}