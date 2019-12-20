import { GameObject } from "./world_generator/services/GameObject";
import { Mesh, Scene } from 'babylonjs';
import { CreateMeshModifier } from "./world_generator/modifiers/CreateMeshModifier";
import { ModelLoader } from "./world_generator/services/ModelLoader";
import { WorldGeneratorServices } from "./world_generator/services/WorldGeneratorServices";
import { ConverterService } from "./world_generator/services/ConverterService";

export enum FileFormat {
    TEXT, SVG
}

export interface Converter {
    convert(worldItem: GameObject): Mesh;
    addChildren(parent: Mesh, children: Mesh[]): void;
    addBorders(item: Mesh, borders: Mesh[]): void;
    done();
}

export class WorldGenerator {
    private createMeshModifier: CreateMeshModifier;
    private modelImportService: ModelLoader;

    constructor(scene: Scene) {
        this.modelImportService = new ModelLoader(scene);
        this.createMeshModifier = new CreateMeshModifier(scene, this.modelImportService);
    }

    generate(worldMap: string, converter: Converter, fileFormat: FileFormat) {

        const serviceFacade = new WorldGeneratorServices(
            this.modelImportService,
            this.createMeshModifier,
            fileFormat
        );

        const converterService = new ConverterService();

        serviceFacade.generateWorld(worldMap)
            .then(gameObjects => converterService.convert(gameObjects, converter))
            .catch(e => console.log(e));
    }
}