import { Scene } from 'babylonjs/scene';
import { WorldGenerator, Converter } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonModelImportService } from './services/BabylonModelImportService';
import { ConfigService } from '../../model/services/ConfigService';
import { ServiceFacade } from '../../model/services/ServiceFacade';
import { GlobalsSectionParser } from '../../model/parsers/GlobalSectionParser';


export class BabylonWorldGenerator<T> implements WorldGenerator<T> {
    private meshFactoryService: BabylonMeshFactoryService;
    private meshLoaderService: BabylonModelImportService;

    constructor(scene: Scene) {
        this.meshFactoryService = new BabylonMeshFactoryService(scene);
        this.meshLoaderService = new BabylonModelImportService(scene);
    }

    generate(worldMap: string, converter: Converter<T>) {

        const configService = new ConfigService().update(worldMap);
        configService.globalConfig = new GlobalsSectionParser().parse(worldMap);

        const serviceFacade = new ServiceFacade<any, any, T>(
            this.meshFactoryService,
            this.meshLoaderService,
            configService
        );

        this.meshLoaderService
            .loadAll(configService.meshDescriptors.filter(descriptor => descriptor.model))
            .then(() => {
                const worldItems = serviceFacade.importerService.import(worldMap);

                serviceFacade.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }
}