import { Rectangle } from "./geometry/shapes/Rectangle";
import { GroupContext } from "./views/GroupContext";


export enum ViewType {
    GameObject = 'GameObject',
    Path = 'Path'
}

export interface View {
    groupContext: GroupContext;
    viewType: ViewType;
    dimensions: Rectangle;
}