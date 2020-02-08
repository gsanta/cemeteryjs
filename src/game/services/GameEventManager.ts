import { GameFacade } from '../GameFacade';
import { IEventListener } from "./listeners/IEventListener";
import { IEventTrigger } from "./triggers/IEventTrigger";
import { InputCommand } from '../stores/InputCommandStore';
import { ILifeCycleTrigger, LifeCycleEvent } from './triggers/ILifeCycleTrigger';


export class GameEventManager {
    private events: GameEvent[] = [];
    private triggers: IEventTrigger[] = [];
    private lifeCycleTriggers: ILifeCycleTrigger[] = [];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.triggerLifeCycleEvent = this.triggerLifeCycleEvent.bind(this);
        this.triggerEvent = this.triggerEvent.bind(this);
    }

    registerListener(listener: IEventListener): void {
        this.events.push(...listener.events);
    }

    registerTrigger(trigger: IEventTrigger): void {
        this.triggers.push(trigger);
        trigger.activate(this.triggerEvent);
    }

    registerLifeCycleTrigger(trigger: ILifeCycleTrigger) {
        this.lifeCycleTriggers.push(trigger);
        trigger.activate(this.triggerLifeCycleEvent);
    }

    private triggerEvent(): void {
        this.events
            .filter(event => event.matches(this.gameFacade))
            .forEach(event => event.action(this.gameFacade));
    }

    private triggerLifeCycleEvent(lifeCycleEvent?: LifeCycleEvent): void {
        this.events
            .filter(event => event.matches(this.gameFacade, lifeCycleEvent))
            .forEach(event => event.action(this.gameFacade));
    }
}

interface GameEventTrigger {
    readonly inputCommand: InputCommand;
    readonly lifeCycleEvent?: LifeCycleEvent;
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
