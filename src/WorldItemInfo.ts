import { Polygon, Shape } from "@nightshifts.inc/geometry";
import { MeshTemplate } from './integrations/api/MeshTemplate';

/**
 * `WorldItemInfo` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class WorldItemInfo<M = any, S = any> {
    meshTemplate: MeshTemplate<M, S>;
    skeleton: any;
    id: number;
    type: string;
    name: string;
    /**
     * This property can be used to group multiple `WorldItemInfo` together, e.g some of the final 'Game Objects' (see `Converter`) can consist
     * of multiple `WorldItemInfo` and this is the property to signal that relationship.
     */
    group: number;
    dimensions: Shape;
    normalizedDimensions: Shape;
    rotation: number;
    thickness: number;
    isBorder: boolean;
    children: WorldItemInfo[] = [];
    parent: WorldItemInfo;
    borderItems: WorldItemInfo[] = [];
    rooms: WorldItemInfo[] = [];

    constructor(id: number, type: string, dimensions: Shape, name: string, isBorder: boolean = false, rotation = 0) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.isBorder = isBorder;
        this.id = id;
        this.rotation = rotation;
    }

    addChild(worldItem: WorldItemInfo) {
        this.children.push(worldItem);
    }
}
