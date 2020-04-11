import { GameEventManager } from "../GameEventManager";


export interface IEventTrigger {
    activate(eventManager: GameEventManager): void;
}