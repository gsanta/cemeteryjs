import { GameObject } from "./model/types/GameObject";
import { Mesh, Scene } from 'babylonjs';
import { CreateMeshModifier } from "./model/modifiers/CreateMeshModifier";
import { ModelLoader } from "./model/services/ModelLoader";
import { WorldGeneratorServices } from "./model/services/WorldGeneratorServices";
import { ConverterService } from "./model/services/ConverterService";

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