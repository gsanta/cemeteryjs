import { MeshView } from "../../common/views/MeshView";
import { Converter } from "./WorldGenerator";
import { Mesh } from "babylonjs";
import { MeshObject } from "../models/objects/MeshObject";

export interface Convert {
    (worldItemInfo: MeshObject): Mesh
}

export interface AddChildren<Mesh> {
    (parent: Mesh, children: Mesh[]): void;
}

export interface AddBorders<Mesh> {
    (item: Mesh, borders: Mesh[]): void;
}

export class ConverterService {
    convert(meshObjects: MeshObject[], converter: Converter): void {
        const map: Map<MeshObject, Mesh> = new Map();

        meshObjects.forEach(rootItem => {
            map.set(rootItem, converter.convert(rootItem));
        });

        map.forEach((val: Mesh, key: MeshObject) => {
            const children = key.children.map(child => map.get(child));

            if (children.length > 0) {
                converter.addChildren(val, children);
            }
        });

        converter.done();
    }
}