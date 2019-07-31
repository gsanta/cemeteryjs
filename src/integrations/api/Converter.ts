import { WorldItemInfo } from "../../WorldItemInfo";

export interface Convert<T> {
    (worldItemInfo: WorldItemInfo): T
}

export interface AddChildren<T> {
    (parent: T, children: T[]): void;
}

export interface AddBorders<T> {
    (item: T, borders: T[]): void;
}

export interface Converter<T> {
    convert(worldItemInfo: WorldItemInfo[], convert: Convert<T>, addChildren: AddChildren<T>, addBorders: AddBorders<T>): T[];
}