import { Polygon, Shape } from "@nightshifts.inc/geometry";

/**
 * `WorldItemInfo` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class WorldItemInfo<T = any> {
    public id: number;
    public type: string;
    public name: string;
    public dimensions: Shape;
    public rotation: number;
    public additionalData: T;
    public children: WorldItemInfo[] = [];
    public borderItems: WorldItemInfo[] = [];
    public indexedBorderItems: {
        roomBoundingPolygonSideIndex: number;
        sizeRatio: number;
        borderItem: WorldItemInfo;
    }[] = [];

    constructor(id: number, type: string, dimensions: Shape, name: string, additionalData: T = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
        this.id = id;
        this.rotation = 0;
    }

    public addChild(worldItem: WorldItemInfo) {
        this.children.push(worldItem);
    }
}
