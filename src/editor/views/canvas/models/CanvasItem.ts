
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

export function isFeedback(canvasItem: CanvasItem) {
    return canvasItem.type.endsWith('Feedback');
}

export function isConcept(canvasItem: CanvasItem) {
    return canvasItem.type.endsWith('Concept');
}