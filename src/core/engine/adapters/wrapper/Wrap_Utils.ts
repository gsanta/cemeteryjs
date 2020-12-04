import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export function executeEnginesUntilValReturned<T>(engineFacade: Wrap_EngineFacade,callback: (index: number) => T): T {
    for (let i = 0; i < engineFacade.engines.length; i++) {
        const val = <T> callback(i);
        if (val !== undefined) {
            return val;
        }
    }
}