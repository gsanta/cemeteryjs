import { Skeleton, Mesh, Vector3 } from 'babylonjs';
import { Shape } from '../../model/geometry/shapes/Shape';

export enum WorldItemShape {
    RECTANGLE = 'rect',
    MODEL = 'model'
}

/**
 * `GameObject` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class GameObject {
    meshName: string;
    skeleton: Skeleton;
    name: string;
    dimensions: Shape;
    rotation: number;
    children: GameObject[] = [];
    parent: GameObject;
    frontVector: Vector3;

    color: string;
    shape: WorldItemShape;
    scale: number;

    speed = 0.003;

    modelFileName: string;

    constructor(dimensions: Shape, name: string, rotation = 0) {
        this.dimensions = dimensions;
        this.name = name;
        this.rotation = rotation;
    }

    addChild(worldItem: GameObject) {
        this.children.push(worldItem);
    }

    equalTo(worldItem: GameObject) {
        return (
            this.name === worldItem.name &&
            this.dimensions.equalTo(worldItem.dimensions) &&
            this.rotation === worldItem.rotation
        );
    }
}