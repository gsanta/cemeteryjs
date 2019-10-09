import { Scene } from 'babylonjs/scene';
import { WorldGenerator, Converter } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonMeshTemplateService } from './services/BabylonMeshTemplateService';
import { MeshDescriptor } from '../../Config';
import { ConfigService } from '../../model/services/ConfigService';
import { ServiceFacade } from '../../model/services/ServiceFacade';
import { DefinitionSectionParser } from '../../model/parsers/DefinitionSectionParser';
import { GlobalsSectionParser } from '../../model/parsers/GlobalSectionParser';


export class BabylonWorldGenerator<T> implements WorldGenerator<T> {
    private meshFactoryService: BabylonMeshFactoryService;
    private meshLoaderService: BabylonMeshTemplateService;

    constructor(scene: Scene) {
        this.meshFactoryService = new BabylonMeshFactoryService(scene);
        this.meshLoaderService = new BabylonMeshTemplateService(scene);
    }

    generate(worldMap: string, meshDescriptors: MeshDescriptor[], converter: Converter<T>) {
        const meshDescriptorMap: Map<string, MeshDescriptor> = new Map();
        meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));

        const configService = new ConfigService().update(worldMap);
        configService.globalConfig = new GlobalsSectionParser().parse(worldMap);

        const serviceFacade = new ServiceFacade<any, any, T>(
            this.meshFactoryService,
            this.meshLoaderService,
            configService
        );

        this.meshLoaderService
            .loadAll(meshDescriptors)
            .then(() => {
                const worldItems = serviceFacade.importerService.import(worldMap);

                serviceFacade.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }
}