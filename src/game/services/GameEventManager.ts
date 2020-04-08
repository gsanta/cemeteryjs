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

export class AfterRenderListener implements IEventListener {

    constructor()
}

export class GameEventManager {
    private events: IEventListener[] = [];
    private triggers: IEventTrigger[] = [];
    private lifeCycleTriggers: ILifeCycleTrigger[] = [];
    private gameFacade: GameFacade;
    listeners: Listeners = new Listeners();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    triggerGamepadEvent(gamepadEvent: GamepadEvent) {
        const events = this.events.filter(event => event.eventType === EventType.Keyboard);

        events.forEach(event => (<IGamepadListener> event).gamepadEvent(gamepadEvent));
    }

    triggerAfterRenderEvent(): void {
        const events = this.events.filter(event => event.eventType === EventType.AfterRender);

        events.forEach(event => (<IAfterRender> event).afterRender());
    }

    triggerResetEvent(): void {
        const events = this.events.filter(event => event.eventType === EventType.AfterRender);

        events.forEach(event => (<IAfterRender> event).afterRender());
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
