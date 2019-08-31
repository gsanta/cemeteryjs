import { MeshFactoryService } from './MeshFactoryService';
import { MeshLoaderService } from './MeshLoaderService';
import { ConfigService } from './ConfigService';
import { ModifierFactoryService } from './ModifierFactoryService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { ModifierService } from './ModifierService';
import { ParserService } from './ParserService';
import { ConverterService } from './ConverterService';
import { ImporterService } from './ImporterService';

export class ServiceFacade<M, S, T> {
    meshFactoryService: MeshFactoryService<M, S>;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    meshLoaderService: MeshLoaderService<M, S>
    configService: ConfigService;
    modifierService: ModifierService;
    parserService: ParserService;
    converterService: ConverterService<T>;
    importerService: ImporterService<M, S, T>;

    constructor(
        meshFactoryService: MeshFactoryService<any, any>,
        meshLoaderService: MeshLoaderService<any, any>,
        configService: ConfigService
    ) {
        this.converterService = new ConverterService();
        this.meshFactoryService = meshFactoryService;
        this.meshLoaderService = meshLoaderService;
        this.configService = configService;
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.worldItemFactoryService = new WorldItemFactoryService();
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.parserService = new ParserService();
        this.importerService = new ImporterService(this);
    }
}