import { WorldItem } from "../WorldItemInfo";
import { Converter } from "../WorldGenerator";

export interface Convert<T> {
    (worldItemInfo: WorldItem): T
}

export interface AddChildren<T> {
    (parent: T, children: T[]): void;
}

export interface AddBorders<T> {
    (item: T, borders: T[]): void;
}

export interface ConverterService<T> {
    convert(worldItemInfo: WorldItem[], converter: Converter<T>): void;
}