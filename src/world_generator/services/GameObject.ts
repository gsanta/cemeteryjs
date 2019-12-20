import { Skeleton, Mesh } from 'babylonjs';
import { MeshTemplate } from '../../MeshTemplate';
import { GameObjectTemplate, WorldItemRole } from './GameObjectTemplate';
import { Shape } from '../../model/geometry/shapes/Shape';
import { Point } from '../../model/geometry/shapes/Point';

export enum WorldItemShape {
    RECTANGLE = 'rect',
    MODEL = 'model'
}

/**
 * `GameObject` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class GameObject {
    meshTemplate: MeshTemplate<Mesh, Skeleton>;
    skeleton: any;
    id: string;
    type: string;
    name: string;
    roles?: WorldItemRole[];
    /**
     * This property can be used to group multiple `GameObject` together, e.g some of the final GameObjects (see `Converter`) can consist
     * of multiple `GameObject` and this is the property to signal that relationship.
     */
    group: number;
    dimensions: Shape;
    normalizedDimensions: Shape;
    rotation: number;
    thickness: number;
    isBorder: boolean;
    children: GameObject[] = [];
    parent: GameObject;

    borderItems: GameObject[] = [];
    rooms: GameObject[] = [];
    subareaId = 0;
    worldMapPositions: Point[] = [];
    color: string;
    shape: WorldItemShape;

    modelFileName: string;

    definition: GameObjectTemplate;

    constructor(id: string, type: string, dimensions: Shape, name: string, isBorder: boolean = false, rotation = 0) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.isBorder = isBorder;
        this.id = id;
        this.rotation = rotation;
    }

    addChild(worldItem: GameObject) {
        this.children.push(worldItem);
    }

    equalTo(worldItem: GameObject) {
        return (
            this.name === worldItem.name &&
            this.id === worldItem.id &&
            this.type === worldItem.id &&
            this.dimensions.equalTo(worldItem.dimensions) &&
            this.rotation === worldItem.rotation
        );
    }
}