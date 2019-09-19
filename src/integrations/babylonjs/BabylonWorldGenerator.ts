import { Scene } from 'babylonjs/scene';
import { WorldGenerator, Converter } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonMeshTemplateService } from './services/BabylonMeshTemplateService';
import { MeshDescriptor } from '../../Config';
import { WorldConfig } from '../../services/ImporterService';
import { ConfigService } from '../../services/ConfigService';
import { ServiceFacade } from '../../services/ServiceFacade';


export class BabylonWorldGenerator<T> implements WorldGenerator<T> {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    generate(worldMap: string, worldConfig: WorldConfig, converter: Converter<T>) {
        const meshDescriptorMap: Map<string, MeshDescriptor<any>> = new Map();
        worldConfig.meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));

        const meshFactoryService = new BabylonMeshFactoryService(this.scene);
        const meshLoaderService = new BabylonMeshTemplateService(this.scene);

        meshLoaderService
            .loadAll(worldConfig.meshDescriptors)
            .then(() => {

                const configService = new ConfigService(worldConfig.borders, worldConfig.furnitures, '-', meshDescriptorMap, {x: worldConfig.xScale, y: worldConfig.yScale})

                const serviceFacade = new ServiceFacade<any, any, T>(
                    meshFactoryService,
                    meshLoaderService,
                    configService
                );

                const worldItems = serviceFacade.importerService.import(worldMap);

                serviceFacade.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }
}