import { GameFacade } from "../../GameFacade";
import { GameEvent } from "../input/GameEventManager";
import { KeyCode } from "../input/listeners/KeyboardListener";
import { IEventListener } from "./IEventListener";


export class PlayerListener implements IEventListener {
    events: GameEvent[];

    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.events = this.createInteractions();
    }

    private createInteractions() {
        const interactions: GameEvent[] = [
            new GameEvent(
                {keyCode: KeyCode.w},
                (gameFacade: GameFacade) => gameFacade.playerMovement.forward()
            ),
            new GameEvent(
                {keyCode: KeyCode.s},
                (gameFacade: GameFacade) => gameFacade.playerMovement.backward()
            ),
            new GameEvent(
                {keyCode: KeyCode.a},
                (gameFacade: GameFacade) => gameFacade.playerMovement.backward()
            ),
            new GameEvent(
                {keyCode: KeyCode.e},
                (gameFacade: GameFacade) => gameFacade.playerMovement.right()
            )
        ];

        return interactions;
    }

}