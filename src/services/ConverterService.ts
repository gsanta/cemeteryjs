import { WorldItem } from "../WorldItem";
import { Converter } from "../WorldGenerator";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";

export interface Convert<T> {
    (worldItemInfo: WorldItem): T
}

export interface AddChildren<T> {
    (parent: T, children: T[]): void;
}

export interface AddBorders<T> {
    (item: T, borders: T[]): void;
}

export class ConverterService<T> {
    convert(worldItemInfo: WorldItem[], converter: Converter<T>): void {
        const map: Map<WorldItem, T> = new Map();

        const rootItems: T[] = [];

        worldItemInfo.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                map.set(item, converter.convert(item));
                rootItems.push(map.get(item));
            }
        });

        map.forEach((val: T, key: WorldItem) => {
            const children = key.children.map(child => map.get(child));

            if (children.length > 0) {
                converter.addChildren(val, children);
            }

            const borders = key.borderItems.map(border => map.get(border));

            if (borders.length > 0) {
                converter.addBorders(val, borders);
            }
        });

        converter.done();
    }
}