import { Rectangle } from './model/Rectangle';

export class GameObject {
    public type: string;
    public name: string;
    public dimensions: Rectangle;
    public additionalData: any;

    constructor(type: string, dimensions: Rectangle, name: string, additionalData: any = null) {
        this.type = type;
        this.dimensions = dimensions;
        this.name = name;
        this.additionalData = additionalData;
    }
}
