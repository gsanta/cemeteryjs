import { WorldItem } from "./WorldItem";
import { Mesh } from 'babylonjs';

export enum FileFormat {
    TEXT, SVG
}

export interface Converter {
    convert(worldItem: WorldItem): Mesh;
    addChildren(parent: Mesh, children: Mesh[]): void;
    addBorders(item: Mesh, borders: Mesh[]): void;
    done();
}

export interface WorldGenerator {
    generate(worldMap: string, fileFormat: FileFormat, converter: Converter);
}