import { GameObject } from "./GameObject";
import { Converter } from "../../WorldGenerator";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { Mesh } from "babylonjs";

export interface Convert {
    (worldItemInfo: GameObject): Mesh
}

export interface AddChildren<Mesh> {
    (parent: Mesh, children: Mesh[]): void;
}

export interface AddBorders<Mesh> {
    (item: Mesh, borders: Mesh[]): void;
}

export class ConverterService {
    convert(worldItemInfo: GameObject[], converter: Converter): void {
        const map: Map<GameObject, Mesh> = new Map();

        worldItemInfo.forEach(rootItem => {

            for (const item of TreeIteratorGenerator(rootItem)) {
                map.set(item, converter.convert(item));
            }
        });

        map.forEach((val: Mesh, key: GameObject) => {
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