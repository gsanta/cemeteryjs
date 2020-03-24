
export enum CanvasItemType {
    MeshConcept = 'MeshConcept',
    PathConcept = 'PathConcept',
    Subconcept = 'Subconcept',
    RectSelectFeedback = 'RectSelectFeedback'
}

export interface CanvasItem {
    type: CanvasItemType;
}