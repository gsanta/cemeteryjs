import { Scene } from 'babylonjs/scene';
import { WorldGenerator, Converter } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonMeshLoaderService } from './services/BabylonMeshLoaderService';
import { MeshDescriptor } from '../api/Config';
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
        const meshLoaderService = new BabylonMeshLoaderService(this.scene);

        const configService: ConfigService = {
            borderTypes: worldConfig.borders,
            furnitureTypes: worldConfig.furnitures,
            meshDescriptorMap,
            scaling: {
                x: worldConfig.xScale,
                y: worldConfig.yScale
            }
        }

        const serviceFacade = new ServiceFacade<any, any, T>(
            meshFactoryService,
            meshLoaderService,
            configService
        );

        const worldItems = serviceFacade.importerService.import(worldMap);

        serviceFacade.converterService.convert(worldItems, converter);
    }
}