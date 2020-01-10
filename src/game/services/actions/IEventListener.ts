import { GameEvent } from "../input/GameEventManager";

export interface IEventListener {
    events: GameEvent[];
}