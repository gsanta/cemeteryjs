import { WorldItem } from "./WorldItem";

export enum FileFormat {
    TEXT, SVG
}

export interface Converter<T> {
    convert(worldItem: WorldItem): T;
    addChildren(parent: T, children: T[]): void;
    addBorders(item: T, borders: T[]): void;
    done();
}

export interface WorldGenerator<T> {
    generate(worldMap: string, fileFormat: FileFormat, converter: Converter<T>);
}