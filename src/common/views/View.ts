import { Rectangle } from "../../misc/geometry/shapes/Rectangle";
import { GroupContext } from "./GroupContext";

export enum ViewType {
    GameObject = 'GameObject',
    Path = 'Path'
}

export interface View {
    groupContext: GroupContext;
    viewType: ViewType;
    dimensions: Rectangle;
    name: string;
    removeSubviewHover(): void;
    selectHoveredSubview(): void;
}