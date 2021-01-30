import { IPointerEvent } from "../controller/PointerHandler";

export interface IEnginePointerObservable {
    add(callback: (pointerEvent: IPointerEvent) => void);
    remove(callback: (pointerEvent: IPointerEvent) => void);
}

export interface IEngineEventAdapter {
    pointer: IEnginePointerObservable;
}