
export enum CanvasItemType {
    MeshConcept = 'MeshConcept',
    PathConcept = 'PathConcept',
    Subconcept = 'Subconcept',
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback'
}

export interface CanvasItem {
    type: CanvasItemType;
}