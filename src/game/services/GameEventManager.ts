import { GameFacade } from '../GameFacade';
import { IEventListener } from "./listeners/IEventListener";
import { IEventTrigger } from "./triggers/IEventTrigger";
import { InputCommand } from '../stores/InputCommandStore';


export class GameEventManager {
    private events: GameEvent[] = [];
    private triggers: IEventTrigger[] = [];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.trigger = this.trigger.bind(this);
    }

    registerListener(listener: IEventListener): void {
        this.events.push(...listener.events);
    }

    registerTrigger(trigger: IEventTrigger): void {
        this.triggers.push(trigger);
        trigger.activate(this.trigger);
    }

    private trigger(afterRender = false): void {
        const interaction = this.events.find(h => h.matches(this.gameFacade, afterRender));
        interaction && interaction.action(this.gameFacade);
    }
}

interface GameEventTrigger {
    readonly inputCommand: InputCommand;
    readonly isAfterRender: boolean;
}

export class GameEvent {
    readonly trigger: GameEventTrigger;
    readonly action: (gameFacade: GameFacade) => void;

    private static readonly defaultInteractionInfo: GameEventTrigger = {
        inputCommand: null,
        isAfterRender: false
    }

    constructor(interactionInfo: Partial<GameEventTrigger>, action: (gameFacade: GameFacade) => void) {
        this.trigger = {...GameEvent.defaultInteractionInfo, ...interactionInfo};
        this.action = action;
    }

    matches(gameFacade: GameFacade, afterRender: boolean): boolean {
        const hasCommand = gameFacade.inputCommandStore.commands.has(this.trigger.inputCommand);
        return (
            (this.trigger.inputCommand === undefined || hasCommand) &&
            afterRender === this.trigger.isAfterRender
        )
    }
}
