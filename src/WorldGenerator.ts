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

export class NullConverter<T> {
    convert(worldItem: WorldItem): T { return null; };
    addChildren(parent: T, children: T[]): void {};
    addBorders(item: T, borders: T[]): void {};
    done() {
        
    };
}

export interface WorldGenerator<T> {
    generate(worldMap: string, worldConfig: WorldConfig, converter: Converter<T>);
}