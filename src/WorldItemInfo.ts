import { Polygon, Shape } from "@nightshifts.inc/geometry";

/**
 * `WorldItemInfo` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class WorldItemInfo<T = any> {
    mesh: any;
    id: number;
    type: string;
    name: string;
    dimensions: Shape;
    rotation: number;
    isBorder: boolean;
    children: WorldItemInfo[] = [];
    borderItems: WorldItemInfo[] = [];
    indexedBorderItems: {
        roomBoundingPolygonSideIndex: number;
        sizeRatio: number;
        borderItem: WorldItemInfo;
    }[] = [];

    constructor(id: number, type: string, dimensions: Shape, name: string, isBorder: boolean = false) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.isBorder = isBorder;
        this.id = id;
        this.rotation = 0;
    }

    addChild(worldItem: WorldItemInfo) {
        this.children.push(worldItem);
    }
}
