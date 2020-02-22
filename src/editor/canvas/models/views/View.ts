import { Rectangle } from "../../../../misc/geometry/shapes/Rectangle";

export enum ViewType {
    GameObject = 'GameObject',
    Path = 'Path'
}

export interface View {
    viewType: ViewType;
    dimensions: Rectangle;
    name: string;
    removeSubviewHover(): void;
    selectHoveredSubview(): void;
    isSubviewHovered(): boolean;
}