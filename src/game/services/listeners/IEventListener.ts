import { GameEvent } from "../GameEventManager";

export interface IEventListener {
    events: GameEvent[];
}