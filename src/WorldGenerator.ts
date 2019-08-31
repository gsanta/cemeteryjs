import { WorldItem } from "./WorldItemInfo";
import { MeshDescriptor } from './integrations/api/Config';
import { WorldConfig, defaultWorldConfig, ImporterService } from "./services/ImporterService";
import { ServiceFacade } from "./services/ServiceFacade";
import { ConverterService } from './services/ConverterService';
import { MeshFactoryService } from './services/MeshFactoryService';
import { ConfigService } from './services/ConfigService';
import { MeshLoaderService } from './services/MeshLoaderService';
import { ModifierFactoryService } from './services/ModifierFactoryService';


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
    private meshFactoryService: MeshFactoryService<any, any>;
    private meshLoaderService: MeshLoaderService<any, any>;

    constructor(meshFactoryService: MeshFactoryService<any, any>, meshLoaderService: MeshLoaderService<any, any>) {
        this.meshFactoryService = meshFactoryService;
        this.meshLoaderService = meshLoaderService;
    }

    generate(worldMap: string, meshDescriptors: MeshDescriptor<any>[], worldConfig: WorldConfig = defaultWorldConfig) {
        const meshDescriptorMap: Map<string, MeshDescriptor<any>> = new Map();
        meshDescriptors.map(descriptor => meshDescriptorMap.set(descriptor.type, descriptor));


        const configService: ConfigService = {
            borderTypes: worldConfig.borders,
            furnitureTypes: worldConfig.furnitures,
            meshDescriptorMap,
            scaling: {
                x: worldConfig.xScale,
                y: worldConfig.yScale
            }
        }

        const serviceFacade = new ServiceFacade<any, any, T>(
            this.meshFactoryService,
            this.meshLoaderService,
            configService
        );

        return serviceFacade.importerService.import(worldMap);
    }
}