import { Scene } from 'babylonjs/scene';
import { ServiceFacade } from '../../model/services/ServiceFacade';
import { Converter, FileFormat, WorldGenerator } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonModelImportService } from './services/BabylonModelImportService';


export class BabylonWorldGenerator<T> implements WorldGenerator<T> {
    private meshFactoryService: BabylonMeshFactoryService;
    private meshLoaderService: BabylonModelImportService;

    constructor(scene: Scene) {
        this.meshFactoryService = new BabylonMeshFactoryService(scene);
        this.meshLoaderService = new BabylonModelImportService(scene);
    }

    generate(worldMap: string, fileFormat: FileFormat, converter: Converter<T>) {

        const serviceFacade = new ServiceFacade<any, any, T>(
            this.meshFactoryService,
            this.meshLoaderService,
            fileFormat
        );

        serviceFacade.generateWorld(worldMap, converter);
    }
}