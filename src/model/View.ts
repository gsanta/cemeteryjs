import { Rectangle } from "./geometry/shapes/Rectangle";


export enum ViewType {
    GameObject = 'GameObject',
    Path = 'Path'
}

export interface View {
    viewType: ViewType;
    dimensions: Rectangle;
}