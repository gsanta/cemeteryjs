import { KeyboardListener } from "./listeners/KeyboardListener";
import { GameFacade } from '../../GameFacade';
import { IEventListener } from "../actions/IEventListener";


export class GameEventManager {
    private events: GameEvent[] = [];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    registerListener(listener: IEventListener): void {
        this.events.push(...listener.events);
    }

    trigger(afterRender = false): void {
        const interaction = this.events.find(h => h.matches(this.gameFacade.keyboardListener, afterRender));
        interaction && interaction.action(this.gameFacade);
    }
}

interface GameEventTrigger {
    readonly keyCode: number;
    readonly isAfterRender: boolean;
}

export class GameEvent {
    readonly trigger: GameEventTrigger;
    readonly action: (gameFacade: GameFacade) => void;

    private static readonly defaultInteractionInfo: GameEventTrigger = {
        keyCode: null,
        isAfterRender: false
    }

    constructor(interactionInfo: Partial<GameEventTrigger>, action: (gameFacade: GameFacade) => void) {

        this.trigger = {...GameEvent.defaultInteractionInfo, ...interactionInfo};
        this.action = action;
    }

    matches(keyboardListener: KeyboardListener, afterRender: boolean): boolean {
        return (
            (this.trigger.keyCode === undefined || keyboardListener.downKeys.has(String.fromCharCode(this.trigger.keyCode).toLocaleLowerCase())) &&
            afterRender === this.trigger.isAfterRender
        )
    }
}
