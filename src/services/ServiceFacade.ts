import { MeshFactoryService } from './MeshFactoryService';
import { MeshLoaderService } from './MeshLoaderService';
import { ConfigService } from './ConfigService';
import { ModifierFactoryService } from './ModifierFactoryService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { ModifierService } from './ModifierService';
import { ParserService } from './ParserService';
import { ConverterService } from './ConverterService';

export class ServiceFacade<M, S> {
    meshFactoryService: MeshFactoryService<M, S>;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    meshLoaderService: MeshLoaderService<M, S>
    configService: ConfigService;
    modifierService: ModifierService;
    parserService: ParserService;
    converterService: ConverterService<any>;

    constructor() {
        this.meshFactoryService = new MeshFactoryService<M, S>()
    }
}