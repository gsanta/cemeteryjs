import { Scene } from 'babylonjs/scene';
import { ServiceFacade } from '../../model/services/ServiceFacade';
import { Converter, FileFormat, WorldGenerator } from '../../WorldGenerator';
import { BabylonModelImportService } from './services/BabylonModelImportService';
import { ModelImportService } from '../../model/services/ModelImportService';
import { CreateMeshModifier } from '../../model/modifiers/CreateMeshModifier';


export class BabylonWorldGenerator implements WorldGenerator {
    private createMeshModifier: CreateMeshModifier;
    private meshLoaderService: BabylonModelImportService;
    private modelImportService: ModelImportService;

    constructor(scene: Scene) {
        this.createMeshModifier = new CreateMeshModifier(scene);
        this.meshLoaderService = new BabylonModelImportService(scene);
        this.modelImportService = new ModelImportService(scene);
    }

    generate(worldMap: string, fileFormat: FileFormat, converter: Converter) {

        const serviceFacade = new ServiceFacade(
            this.modelImportService,
            this.createMeshModifier,
            fileFormat
        );

        serviceFacade.generateWorld(worldMap, converter);
    }
}