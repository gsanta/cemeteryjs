import { MeshFactoryService } from './MeshFactoryService';
import { MeshTemplateService } from './MeshTemplateService';
import { ConfigService } from './ConfigService';
import { ModifierFactoryService } from './ModifierFactoryService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { ModifierService } from './ModifierService';
import { ParserService } from './ParserService';
import { ConverterService } from './ConverterService';
import { ImporterService } from './ImporterService';
import { GeometryService } from '@nightshifts.inc/geometry';

export class ServiceFacade<M, S, T> {
    meshFactoryService: MeshFactoryService<M, S>;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    meshTemplateService: MeshTemplateService<M, S>
    configService: ConfigService;
    modifierService: ModifierService;
    parserService: ParserService;
    converterService: ConverterService<T>;
    importerService: ImporterService<M, S, T>;
    geometryService: GeometryService;

    constructor(
        meshFactoryService: MeshFactoryService<any, any>,
        meshLoaderService: MeshTemplateService<any, any>,
        configService: ConfigService
    ) {
        this.geometryService = new GeometryService();
        this.configService = configService;
        this.converterService = new ConverterService();
        this.meshFactoryService = meshFactoryService;
        this.meshTemplateService = meshLoaderService;
        this.worldItemFactoryService = new WorldItemFactoryService(this);
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.parserService = new ParserService();
        this.importerService = new ImporterService(this);
    }
}