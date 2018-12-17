import { Rectangle } from './model/Rectangle';

export class GameObject {
    public type: string;
    public name: string;
    public dimensions: Rectangle;

    constructor(type: string, dimensions: Rectangle) {
        this.type = type;
        this.dimensions = dimensions;
    }
}
