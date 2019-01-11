import { Rectangle } from './model/Rectangle';

export class GameObject<T = any> {
    public type: string;
    public name: string;
    public dimensions: Rectangle;
    public additionalData: T;

    constructor(type: string, dimensions: Rectangle, name: string, additionalData: T = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
    }
}
