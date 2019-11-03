import { WorldItemType } from './WorldItemType';
import { WorldItem } from "./WorldItem";


export interface Converter<T> {
    convert(worldItem: WorldItem): T;
    addChildren(parent: T, children: T[]): void;
    addBorders(item: T, borders: T[]): void;
    done();
}

export interface WorldGenerator<T> {
    generate(worldMap: string, converter: Converter<T>);
}