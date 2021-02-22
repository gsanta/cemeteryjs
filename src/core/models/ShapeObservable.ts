import { AbstractShape } from "../../modules/graph_editor/main/models/shapes/AbstractShape";




export enum ShapeEventType {
    PositionChanged = 'PositionChanged',
    ScaleChanged = 'ScaleChanged',
    RotationChanged = 'RotationChanged',
    SelectionChanged = 'SelectionChanged'
}

export interface ShapeEventData {
    shape?: AbstractShape;
    eventType: ShapeEventType;
}

export class ShapeObservable {
    private observers: ((eventData: ShapeEventData) => void)[] = []; 

    add(observer: (eventData: ShapeEventData) => void) {
        this.observers.push(observer);
    }

    remove(observer: (eventData: ShapeEventData) => void) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    emit(eventData: ShapeEventData) {
        this.observers.forEach(observer => observer(eventData));
    }
}