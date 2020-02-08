import { Mesh } from 'babylonjs';
import { MeshObject } from './game/models/objects/MeshObject';

export enum FileFormat {
    TEXT, SVG
}

export interface Converter {
    convert(worldItem: MeshObject): Mesh;
    addChildren(parent: Mesh, children: Mesh[]): void;
    addBorders(item: Mesh, borders: Mesh[]): void;
    done();
}