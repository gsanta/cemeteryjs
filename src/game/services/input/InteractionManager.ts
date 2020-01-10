import { KeyboardListener } from "./listeners/KeyboardListener";
import { GameFacade } from '../../GameFacade';


export class InteractionManager {
    private interactions: Interaction[] = [];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    registerAction(interaction: Interaction): void {
        this.interactions.push(interaction);
    }

    check(): void {
        const interaction = this.interactions.find(h => h.matches(this.gameFacade.keyboardListener));
        interaction && interaction.action(this.gameFacade);
    }
}

interface InteractionInfo {
    readonly keyCode: number;
}

export class Interaction {
    readonly hotkeyInfo: InteractionInfo;
    readonly action: (gameFacade: GameFacade) => void;

    private static readonly defaultInteractionInfo: InteractionInfo = {
        keyCode: null,
    }

    constructor(interactionInfo: Partial<InteractionInfo>, action: (gameFacade: GameFacade) => void) {

        this.hotkeyInfo = {...Interaction.defaultInteractionInfo, ...interactionInfo};
        this.action = action;
    }

    matches(keyboardListener: KeyboardListener): boolean {
        return keyboardListener.downKeys.has(String.fromCharCode(this.hotkeyInfo.keyCode).toLocaleLowerCase());
    }
}
