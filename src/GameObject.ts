import { Rectangle } from './model/Rectangle';
import { Polygon } from './model/Polygon';

export class GameObject<T = any, E = Rectangle> {
    public type: string;
    public name: string;
    public dimensions: E;
    public additionalData: T;

    constructor(type: string, dimensions: E, name: string, additionalData: T = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
    }
}
