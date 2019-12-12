import { Converter, FileFormat } from '../../WorldGenerator';
import { SvgConfigReader } from '../readers/svg/SvgConfigReader';
import { SvgWorldItemBuilder } from '../readers/svg/SvgWorldItemBuilder';
import { TextConfigReader, GlobalConfig } from '../readers/text/TextConfigReader';
import { TextWorldItemBuilder } from '../readers/text/TextWorldItemBuilder';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';
import { WorldMapToSubareaMapConverter } from '../readers/text/WorldMapToSubareaMapConverter';
import { WorldItemStore } from './WorldItemStore';
import { ConverterService } from './ConverterService';
import { ModelImportService } from './ModelImportService';
import { ModifierFactoryService, defaultModifiers } from './ModifierFactoryService';
import { ModifierService } from './ModifierService';
import { WorldItemFactoryService } from './WorldItemFactoryService';
import { IWorldItemBuilder } from '../io/IWorldItemBuilder';
import { Modifier } from '../modifiers/Modifier';
import { ConfigReader } from '../readers/ConfigReader';
import { WorldItemTemplate } from '../../WorldItemTemplate';

export class ServiceFacade {
    worldItemStore: WorldItemStore;
    
    worldItemBuilderService: IWorldItemBuilder;
    modifierService: ModifierService;
    modelImportService: ModelImportService;
    converterService: ConverterService;
    
    worldItemFactoryService: WorldItemFactoryService;
    modifierFactoryService: ModifierFactoryService;

    private fileFormat: FileFormat;

    constructor(modelImportService: ModelImportService, createMeshModifier: Modifier, fileFormat: FileFormat) {
        this.fileFormat = fileFormat;
        this.worldItemStore = new WorldItemStore();
        this.worldItemBuilderService = this.getWorldItemBuilder();
        this.converterService = new ConverterService();
        this.worldItemFactoryService = new WorldItemFactoryService(this);
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.modifierFactoryService.registerInstance(createMeshModifier);
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.modelImportService = modelImportService;
    }

    generateWorld(worldMap: string, converter: Converter) {
        const {worldItemTemplates, globalConfig} = this.getConfigReader().read(worldMap);

        this.worldItemStore = new WorldItemStore(worldItemTemplates, globalConfig);

        let worldItems = this.worldItemBuilderService.build(worldMap);
        
        this.modelImportService.loadAll(worldItems)
            .then(() => {
                worldItems = this.modifierService.applyModifiers(worldItems, defaultModifiers);
                this.converterService.convert(worldItems, converter);
            })
            .catch(e => console.log(e));
    }

    generateMetaData(worldMap: string): {worldItemTemplates: WorldItemTemplate[], globalConfig: GlobalConfig} {
        return this.getConfigReader().read(worldMap);
    }

    private getConfigReader(): ConfigReader {
        switch(this.fileFormat) {
            case FileFormat.TEXT:
                return new TextConfigReader();
            case FileFormat.SVG:
                return new SvgConfigReader();
        }
    }

    private getWorldItemBuilder(): IWorldItemBuilder {
        switch(this.fileFormat) {
            case FileFormat.TEXT:
                return new TextWorldItemBuilder(this, new TextWorldMapReader(this), new WorldMapToRoomMapConverter(), new WorldMapToSubareaMapConverter());
            case FileFormat.SVG:
                return new SvgWorldItemBuilder(this);
        }
    }
}