import { WorldItemShape } from "../../../../../world_generator/services/GameObject";
import { Rectangle } from "../../../../../model/geometry/shapes/Rectangle";

export enum CanvasItemTag {
    SELECTED = 'selected',
    HOVERED = 'hovered'
}

export interface CanvasRect {
    type: string;
    name: string;
    shape: WorldItemShape;
    color: string;
    dimensions: Rectangle;
    rotation: number;
    scale: number;
    modelPath: string;
    texturePath: string;
}