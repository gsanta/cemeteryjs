import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";

export enum ConceptType {
    Mesh = 'Mesh',
    Path = 'Path'
}

export interface Concept {
    conceptType: ConceptType;
    dimensions: Rectangle;
    name: string;
    removeSubviewHover(): void;
    selectHoveredSubview(): void;
    isSubviewHovered(): boolean;
}