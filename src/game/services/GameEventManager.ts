import { GameFacade } from '../GameFacade';
import { IEventListener, IAfterRender, IGamepadListener } from "./listeners/IEventListener";
import { IEventTrigger } from "./triggers/IEventTrigger";
import { InputCommand } from '../stores/InputCommandStore';
import { ILifeCycleTrigger, LifeCycleEvent } from './triggers/ILifeCycleTrigger';
import { Listeners } from './listeners/Listeners';

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

interface GameEventTrigger {
    readonly inputCommand: InputCommand;
    readonly lifeCycleEvent?: LifeCycleEvent;
}

export enum EventType {
    Keyboard = 'Keyboard',
    Reset = 'Reset',
    AfterRender = 'AfterRender'
}

export class GameEvent {
    readonly trigger: GameEventTrigger;
    readonly action: (gameFacade: GameFacade) => void;

    private static readonly defaultInteractionInfo: GameEventTrigger = {
        inputCommand: undefined
    }

    constructor(interactionInfo: Partial<GameEventTrigger>, action: (gameFacade: GameFacade) => void) {
        this.trigger = {...GameEvent.defaultInteractionInfo, ...interactionInfo};
        this.action = action;
    }

    matches(gameFacade: GameFacade, lifeCycleEvent?: LifeCycleEvent): boolean {
        const hasCommand = gameFacade.inputCommandStore.commands.has(this.trigger.inputCommand);
        return (
            (this.trigger.inputCommand === undefined || hasCommand) &&
            lifeCycleEvent === this.trigger.lifeCycleEvent
        );
    }
}
