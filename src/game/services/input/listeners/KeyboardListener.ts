import { GameFacade } from '../../../GameFacade';

export enum KeyCode {
    w = 87,
    a = 65,
    d = 68,
    s = 83
}

export class KeyboardListener {
    downKeys: Set<KeyCode> = new Set();

    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    onKeyDown(key: KeyCode): void {
        this.downKeys.add(key);

        this.gameFacade.interactionManager.check();
    }

    onKeyUp(key: KeyCode): void {
        this.downKeys.delete(key);

        this.gameFacade.interactionManager.check();
    }
}