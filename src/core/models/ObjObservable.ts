import { IObj } from "./objs/IObj";


export enum ObjEventType {
    PositionChanged = 'PositionChanged',
    ScaleChanged = 'ScaleChanged',
    RotationChanged = 'RotationChanged',
    PointerOver = 'PointerOver',
    PointerOut = 'PointerOut'
}

export interface ObjEventData {
    obj: IObj;
    eventType: ObjEventType;
}

export class ObjObservable {
    private observers: ((eventData: ObjEventData) => void)[] = []; 

    add(observer: (eventData: ObjEventData) => void) {
        this.observers.push(observer);
    }

    remove(observer: (eventData: ObjEventData) => void) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    emit(eventData: ObjEventData) {
        this.observers.forEach(observer => observer(eventData));
    }
}