import { WorldItem } from "./WorldItemInfo";
import { MeshDescriptor } from "./integrations/api/Config";
import { WorldConfig, defaultWorldConfig } from "./services/ImporterService";
import { ServiceFacade } from "./services/ServiceFacade";
import { ConverterService } from './services/ConverterService';
import { MeshFactoryService } from './services/MeshFactoryService';
import { ConfigService } from './services/ConfigService';


export interface Convert<T> {
    (worldItem: WorldItem): T
}

export interface AddChildren<T> {
    (parent: T, children: T[]): void;
}

export interface AddBorders<T> {
    (item: T, borders: T[]): void;
}


export interface Converter<T> {
    convert(worldItem: WorldItem): T;
    addChildren(parent: T, children: T[]): void;
    addBorders(item: T, borders: T[]): void;
    done();
}

export class WorldGenerator<T> {

    private converterService: ConverterService<T>;
    private meshFactoryService: MeshFactoryService<any, any>;


    constructor(converterService: ConverterService<T>, meshFactoryService: MeshFactoryService<any, any>) {
        this.converterService = converterService;
        this.meshFactoryService = meshFactoryService;
    }

    generate(worldMap: string, meshDescriptors: MeshDescriptor<any>[], worldConfig: WorldConfig = defaultWorldConfig) {
        const serviceFacade = new ServiceFacade();

        const configService: ConfigService = {
            borderTypes: worldConfig.borders
            realBorderWidths: worldConfig.
            realFurnitureSizes: {[name: string]: Polygon};
            meshDescriptors: meshDescriptors
            scaling: {
                x: worldConfig.xScale;
                y: worldConfig.yScale;
            }
        }

        serviceFacade.meshFactoryService = this.meshFactoryService;
        serviceFacade.configService = new ConfigService();
    }
}