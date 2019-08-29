import { WorldItem } from "../../WorldItemInfo";

export interface Convert<T> {
    (worldItemInfo: WorldItem): T
}

export interface AddChildren<T> {
    (parent: T, children: T[]): void;
}

export interface AddBorders<T> {
    (item: T, borders: T[]): void;
}

export interface Converter<T> {
    convert(worldItemInfo: WorldItem[], convert: Convert<T>, addChildren: AddChildren<T>, addBorders: AddBorders<T>): T[];
}