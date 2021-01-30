import { IEngineEventAdapter, IEnginePointerObservable } from "../../IEngineEventAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";


export class Wrap_EventAdapter implements IEngineEventAdapter {
    pointer: IEnginePointerObservable;

    constructor(engineFacade: Wrap_EngineFacade) {
        this.pointer = engineFacade.realEngine.events.pointer;
    }
}