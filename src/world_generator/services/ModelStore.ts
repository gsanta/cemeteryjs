import { Rectangle } from "../../model/geometry/shapes/Rectangle";

export interface ModelObject {
    name: string;
    fileName: string;
    dimensions: Rectangle;
}

export class ModelStore {
    models: ModelObject[];
}