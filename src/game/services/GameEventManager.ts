import { Listeners } from './listeners/Listeners';

export enum EventType {
    Keyboard = 'Keyboard',
    Reset = 'Reset',
    AfterRender = 'AfterRender'
}

export enum GamepadEvent {
    Forward = 'Forward',
    Backward = 'Backward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

export class GameEventListener {
    eventType: EventType;
    action: () => void;

    private constructor(eventType: EventType, action: () => void) {
        this.action = action;
        this.eventType = eventType;
    }

    static AfterRenderListener(action: () => void) {
        const eventListener = new GameEventListener(EventType.AfterRender, action);
    }
}

export class GameEventManager {
    listeners: Listeners = new Listeners();

    triggerGamepadEvent(gamepadEvent: GamepadEvent) {
        this.listeners.getGamepadListeners().forEach(listener => listener(gamepadEvent));
    }

    triggerAfterRenderEvent(): void {
        this.listeners.getAfterRenderListeners().forEach(listener => listener());
    }
}

