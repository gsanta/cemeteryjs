import { Mesh } from 'babylonjs';
import { GameObject } from "./world_generator/services/GameObject";

export enum FileFormat {
    TEXT, SVG
}

export interface Converter {
    convert(worldItem: GameObject): Mesh;
    addChildren(parent: Mesh, children: Mesh[]): void;
    addBorders(item: Mesh, borders: Mesh[]): void;
    done();
}