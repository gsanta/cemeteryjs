import { Point, Shape } from "@nightshifts.inc/geometry";
import { MeshTemplate } from './MeshTemplate';
import { WorldItemDefinition } from './WorldItemDefinition';

export enum WorldItemShape {
    RECTANGLE = 'rect',
    MODEL = 'model'
}

/**
 * `WorldItem` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class WorldItem<M = any, S = any> {
    meshTemplate: MeshTemplate<M, S>;
    skeleton: any;
    id: string;
    type: string;
    name: string;
    /**
     * This property can be used to group multiple `WorldItem` together, e.g some of the final 'Game Objects' (see `Converter`) can consist
     * of multiple `WorldItem` and this is the property to signal that relationship.
     */
    group: number;
    dimensions: Shape;
    normalizedDimensions: Shape;
    rotation: number;
    thickness: number;
    isBorder: boolean;
    children: WorldItem[] = [];
    parent: WorldItem;

    borderItems: WorldItem[] = [];
    rooms: WorldItem[] = [];
    subareaId = 0;
    worldMapPositions: Point[] = [];
    color: string;
    shape: WorldItemShape;

    modelPath: string;

    definition: WorldItemDefinition;

    constructor(id: string, type: string, dimensions: Shape, name: string, isBorder: boolean = false, rotation = 0) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.isBorder = isBorder;
        this.id = id;
        this.rotation = rotation;
    }

    addChild(worldItem: WorldItem) {
        this.children.push(worldItem);
    }

    equalTo(worldItem: WorldItem) {
        return (
            this.name === worldItem.name &&
            this.id === worldItem.id &&
            this.type === worldItem.id &&
            this.dimensions.equalTo(worldItem.dimensions) &&
            this.rotation === worldItem.rotation
        );
    }
}
