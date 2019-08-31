import { MeshFactoryService } from './MeshFactoryService';
import { MeshLoaderService } from './MeshLoaderService';
import { ConfigService } from './ConfigService';
import { ModifierFactoryService } from './ModifierFactoryService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { ModifierService } from './ModifierService';

export class ServiceFacade<M, S> {
    meshFactoryService: MeshFactoryService<M, S>;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    meshLoaderService: MeshLoaderService<M, S>
    configService: ConfigService;
    modifierService: ModifierService;

    constructor() {

    }
}