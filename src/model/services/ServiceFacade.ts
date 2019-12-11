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
import { WorldItemStore } from './WorldItemStore';
import { ConverterService } from './ConverterService';
import { ModelImportService } from './ModelImportService';
import { ModifierFactoryService, defaultModifiers } from './ModifierFactoryService';
import { ModifierService } from './ModifierService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { IWorldItemBuilder } from '../io/IWorldItemBuilder';
import { Modifier } from '../modifiers/Modifier';
import { ConfigReader } from '../readers/ConfigReader';

export class ServiceFacade<M = any, S = any, T = any> {
    worldItemStore: WorldItemStore;
    
    worldItemBuilderService: IWorldItemBuilder;
    modifierService: ModifierService;
    modelImportService: ModelImportService;
    converterService: ConverterService<T>;
    
    worldItemFactoryService: WorldItemFactoryService;
    modifierFactoryService: ModifierFactoryService;
    geometryService: GeometryService;
    configReader: ConfigReader;

    constructor(modelImportService: ModelImportService, createMeshModifier: Modifier, fileFormat: FileFormat) {
        if (fileFormat === FileFormat.TEXT) {
            this.configReader = new TextConfigReader();
            this.worldItemStore = new WorldItemStore();
            this.worldItemBuilderService = new TextWorldItemBuilder(this, new TextWorldMapReader(this), new WorldMapToRoomMapConverter(), new WorldMapToSubareaMapConverter());
        } else if (fileFormat === FileFormat.SVG) {
            this.configReader = new SvgConfigReader();
            this.worldItemStore = new WorldItemStore();
            this.worldItemBuilderService = new SvgWorldItemBuilder(this);
        } else {
            throw new Error('Unknown file format: ' + fileFormat); 
        }

        this.geometryService = new GeometryService();
        this.converterService = new ConverterService();
        this.worldItemFactoryService = new WorldItemFactoryService(this);
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.modifierFactoryService.registerInstance(createMeshModifier);
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.modelImportService = modelImportService;
    }

    generateWorld(worldMap: string, converter: Converter<T>) {
        const {worldItemTemplates, globalConfig} = this.configReader.read(worldMap);

        this.worldItemStore = new WorldItemStore(worldItemTemplates, globalConfig);

        let worldItems = this.worldItemBuilderService.build(worldMap);
        
        this.modelImportService.loadAll(worldItems)
            .then(() => {
                worldItems = this.modifierService.applyModifiers(worldItems, defaultModifiers);
                this.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }
}