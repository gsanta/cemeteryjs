import { AbstractGameObj } from "./objs/AbstractGameObj";

export enum CanvasEventType {
    PositionChanged = 'PositionChanged',
    ScaleChanged = 'ScaleChanged',
    RotationChanged = 'RotationChanged',
    PointerOver = 'PointerOver',
    PointerOut = 'PointerOut',
    SelectionChanged = 'SelectionChanged',
    TagChanged = 'TagChanged',
}

export interface CanvasEventData {
    obj?: AbstractGameObj;
    eventType: CanvasEventType;
}

export class CanvasObservable {
    private observers: ((eventData: CanvasEventData) => void)[] = []; 

    add(observer: (eventData: CanvasEventData) => void) {
        this.observers.push(observer);
    }

    remove(observer: (eventData: CanvasEventData) => void) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    emit(eventData: CanvasEventData) {
        this.observers.forEach(observer => observer(eventData));
    }
}