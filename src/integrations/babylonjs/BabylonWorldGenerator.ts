import { Scene } from 'babylonjs/scene';
import { WorldGenerator, Converter } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonMeshTemplateService } from './services/BabylonMeshTemplateService';
import { MeshDescriptor } from '../../Config';
import { WorldConfig } from '../../model/services/ImporterService';
import { ConfigService } from '../../model/services/ConfigService';
import { ServiceFacade } from '../../model/services/ServiceFacade';
import { DefinitionSectionParser } from '../../model/parsers/DefinitionSectionParser';


export class BabylonWorldGenerator<T> implements WorldGenerator<T> {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    generate(worldMap: string, meshDescriptors: MeshDescriptor[], converter: Converter<T>) {
        const meshDescriptorMap: Map<string, MeshDescriptor<any>> = new Map();
        meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));

        const meshFactoryService = new BabylonMeshFactoryService(this.scene);
        const meshLoaderService = new BabylonMeshTemplateService(this.scene);

        const configService = new ConfigService(worldMap, meshDescriptorMap);
        configService.typeToCharMap = new DefinitionSectionParser().parse(worldMap);

        const serviceFacade = new ServiceFacade<any, any, T>(
            meshFactoryService,
            meshLoaderService,
            configService
        );

        meshLoaderService
            .loadAll(meshDescriptors)
            .then(() => {
                const worldItems = serviceFacade.importerService.import(worldMap);

                serviceFacade.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }
}