import { Polygon } from './Polygon';

export class WorldItem<T = any> {
    public type: string;
    public name: string;
    public dimensions: Polygon;
    public additionalData: T;
    public childWorldItems: WorldItem[] = [];

    constructor(type: string, dimensions: Polygon, name: string, additionalData: T = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
    }

    public addChild(worldItem: WorldItem) {
        this.childWorldItems.push(worldItem);
    }
}
