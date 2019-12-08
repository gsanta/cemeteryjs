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
import { ImporterService } from './ImporterService';
import { MeshFactoryService } from './MeshFactoryService';
import { MeshTemplateService } from './MeshTemplateService';
import { ModelImportService } from './ModelImportService';
import { ModifierFactoryService } from './ModifierFactoryService';
import { ModifierService } from './ModifierService';
import { WorldItemFactoryService } from './WorldItemFactoryService';

export class ServiceFacade<M = any, S = any, T = any> {
    meshFactoryService: MeshFactoryService;
    modifierFactoryService: ModifierFactoryService;
    worldItemFactoryService: WorldItemFactoryService;
    meshTemplateService: MeshTemplateService<M, S>
    configService: ConfigService;
    modifierService: ModifierService;
    builderService: BuilderService;
    converterService: ConverterService<T>;
    importerService: ImporterService<M, S, T>;
    geometryService: GeometryService;
    modelImportService: ModelImportService;

    constructor(meshFactoryService: MeshFactoryService, meshTemplateService: MeshTemplateService<any, any>, modelImportService: ModelImportService, fileFormat: FileFormat) {
        if (fileFormat === FileFormat.TEXT) {
            this.configService = new ConfigService(new TextConfigReader());
            const textWorldItemBuilder = new TextWorldItemBuilder(this, new TextWorldMapReader(this.configService), new WorldMapToRoomMapConverter(this.configService), new WorldMapToSubareaMapConverter(this.configService));
            this.importerService = new ImporterService(this, textWorldItemBuilder);
        } else if (fileFormat === FileFormat.SVG) {
            this.configService = new ConfigService(new SvgConfigReader());
            const svgWorldItemBuilder = new SvgWorldItemBuilder(this);
            this.importerService = new ImporterService(this, svgWorldItemBuilder);
        } else {
            throw new Error('Unknown file format: ' + fileFormat); 
        }

        this.geometryService = new GeometryService();
        this.converterService = new ConverterService();
        this.meshFactoryService = meshFactoryService;
        this.meshTemplateService = meshTemplateService;
        this.worldItemFactoryService = new WorldItemFactoryService(this);
        this.modifierFactoryService = new ModifierFactoryService(this);
        this.modifierService = new ModifierService(this.modifierFactoryService);
        this.builderService = new BuilderService();
        this.modelImportService = modelImportService;
    }

    generateWorld(worldMap: string, converter: Converter<T>) {
        this.configService.update(worldMap);
        this.meshTemplateService
        .loadAll(this.configService.meshDescriptors.filter(descriptor => descriptor.model))
        .then(() => {
            const worldItems = this.importerService.import(worldMap);

            // const promises = worldItems
            //     .filter(item => item.shape === 'model')
            //     .map(item => {
                    
            //         new ModelImportService()

            //     });

            this.converterService.convert(worldItems, converter);
        })
        .catch(e => console.log(e));
    }
}