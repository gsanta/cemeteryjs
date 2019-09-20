import { WorldItem } from "./WorldItem";
import { MeshDescriptor } from './Config';
import { WorldConfig, defaultWorldConfig, ImporterService } from "./model/services/ImporterService";
import { ServiceFacade } from "./model/services/ServiceFacade";
import { ConverterService } from './model/services/ConverterService';
import { MeshFactoryService } from './model/services/MeshFactoryService';
import { ConfigService } from './model/services/ConfigService';
import { MeshTemplateService } from './model/services/MeshTemplateService';
import { ModifierFactoryService } from './model/services/ModifierFactoryService';


export interface Converter<T> {
    convert(worldItem: WorldItem): T;
    addChildren(parent: T, children: T[]): void;
    addBorders(item: T, borders: T[]): void;
    done();
}

export interface WorldGenerator<T> {
    generate(worldMap: string, worldConfig: WorldConfig, converter: Converter<T>);
}