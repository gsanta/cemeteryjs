import { Polygon } from "@nightshifts.inc/geometry";

/**
 * `WorldItemInfo` represents any distinguishable item in the parsed world (think of it as a mesh, e.g walls, rooms, creatures).
 */
export class WorldItemInfo<T = any> {
    public id: number;
    public type: string;
    public name: string;
    public dimensions: Polygon;
    public additionalData: T;
    public children: WorldItemInfo[] = [];
    public borderItems: WorldItemInfo[] = [];

    constructor(type: string, dimensions: Polygon, name: string, additionalData: T = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
    }

    public addChild(worldItem: WorldItemInfo) {
        this.children.push(worldItem);
    }

    public clone() {
        const clone = new WorldItemInfo(this.type, this.dimensions, this.name, this.additionalData);
        clone.children = this.children;
        clone.borderItems = this.borderItems;

        return clone;
    }
}
