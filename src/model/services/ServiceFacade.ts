import { GeometryService } from '@nightshifts.inc/geometry';
import { Converter, FileFormat } from '../../WorldGenerator';
import { SvgConfigReader } from '../readers/svg/SvgConfigReader';
import { SvgWorldItemBuilder } from '../readers/svg/SvgWorldItemBuilder';
import { TextConfigReader } from '../readers/text/TextConfigReader';
import { TextWorldItemBuilder } from '../readers/text/TextWorldItemBuilder';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';
import { WorldMapToSubareaMapConverter } from '../readers/text/WorldMapToSubareaMapConverter';
import { BuilderService } from './BuilderService';
import { ConfigService } from './ConfigService';
import { ConverterService } from './ConverterService';
import { MeshFactoryService } from './MeshFactoryService';
import { ModelImportService } from './ModelImportService';
import { ModifierFactoryService, defaultModifiers } from './ModifierFactoryService';
import { ModifierService } from './ModifierService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { IWorldItemBuilder } from '../io/IWorldItemBuilder';

export class ServiceFacade<M = any, S = any, T = any> {
    meshFactoryService: MeshFactoryService;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    configService: ConfigService;
    modifierService: ModifierService;
    builderService: BuilderService;
    worldItemBuilderService: IWorldItemBuilder;
    converterService: ConverterService<T>;
    geometryService: GeometryService;
    modelImportService: ModelImportService;

    constructor(meshFactoryService: MeshFactoryService, modelImportService: ModelImportService, fileFormat: FileFormat) {
        if (fileFormat === FileFormat.TEXT) {
            this.configService = new ConfigService(new TextConfigReader());
            this.worldItemBuilderService = new TextWorldItemBuilder(this, new TextWorldMapReader(this.configService), new WorldMapToRoomMapConverter(this.configService), new WorldMapToSubareaMapConverter(this.configService));
        } else if (fileFormat === FileFormat.SVG) {
            this.configService = new ConfigService(new SvgConfigReader());
            this.worldItemBuilderService = new SvgWorldItemBuilder(this);
        } else {
            throw new Error('Unknown file format: ' + fileFormat); 
        }

        this.geometryService = new GeometryService();
        this.converterService = new ConverterService();
        this.meshFactoryService = meshFactoryService;
        this.worldItemFactoryService = new WorldItemFactoryService(this);
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.builderService = new BuilderService();
        this.modelImportService = modelImportService;
    }

    generateWorld(worldMap: string, converter: Converter<T>) {
        this.configService.update(worldMap);

        let worldItems = this.worldItemBuilderService.build(worldMap);
        
        this.modelImportService.loadAll(worldItems)
            .then(() => {
                worldItems = this.modifierService.applyModifiers(worldItems, defaultModifiers);
                this.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }
}