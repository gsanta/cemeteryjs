import { MeshFactoryService } from './MeshFactoryService';
import { MeshTemplateService } from './MeshTemplateService';
import { ConfigService } from './ConfigService';
import { ModifierFactoryService } from './ModifierFactoryService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { ModifierService } from './ModifierService';
import { BuilderService } from './BuilderService';
import { ConverterService } from './ConverterService';
import { ImporterService } from './ImporterService';
import { GeometryService } from '@nightshifts.inc/geometry';
import { FileFormat, Converter } from '../../WorldGenerator';
import { TextConfigReader } from '../readers/text/TextConfigReader';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';
import { WorldMapToSubareaMapConverter } from '../readers/text/WorldMapToSubareaMapConverter';

export class ServiceFacade<M, S, T> {
    meshFactoryService: MeshFactoryService<M, S>;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    meshTemplateService: MeshTemplateService<M, S>
    configService: ConfigService;
    modifierService: ModifierService;
    parserService: BuilderService;
    converterService: ConverterService<T>;
    importerService: ImporterService<M, S, T>;
    geometryService: GeometryService;

    constructor(meshFactoryService: MeshFactoryService<any, any>, meshTemplateService: MeshTemplateService<any, any>, fileFormat: FileFormat) {
        if (fileFormat === FileFormat.TEXT) {
            this.configService = new ConfigService(new TextConfigReader());
            this.importerService = new ImporterService(this, new TextWorldMapReader(this.configService), new WorldMapToRoomMapConverter(this.configService), new WorldMapToSubareaMapConverter(this.configService))
        }

        this.geometryService = new GeometryService();
        this.converterService = new ConverterService();
        this.meshFactoryService = meshFactoryService;
        this.meshTemplateService = meshTemplateService;
        this.worldItemFactoryService = new WorldItemFactoryService(this);
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.parserService = new BuilderService();
    }

    generateWorld(worldMap: string, converter: Converter<T>) {
        this.meshTemplateService
        .loadAll(this.configService.meshDescriptors.filter(descriptor => descriptor.model))
        .then(() => {
            const worldItems = this.importerService.import(worldMap);

            this.converterService.convert(worldItems, converter);
        })
        .catch(e => console.log(e));
    }
}