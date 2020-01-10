import { GameEventManager } from "../GameEventManager";


export interface IEventTrigger {
    activate(trigger: (isAfterRender: boolean) => void): void;
}