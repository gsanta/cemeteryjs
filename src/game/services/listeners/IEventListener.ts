import { EventType, GamepadEvent } from "../GameEventManager";

export interface IEventListener {
    eventType: EventType;
}

export interface IGamepadListener extends IEventListener {
    gamepadEvent(gamepadEvent: GamepadEvent): void;
}

export interface IAfterRender extends IEventListener {
    afterRender(): void;
}