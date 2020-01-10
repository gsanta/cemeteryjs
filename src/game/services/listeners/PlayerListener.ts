import { GameFacade } from "../../GameFacade";
import { GameEvent } from "../GameEventManager";
import { IEventListener } from "./IEventListener";
import { InputCommand } from "../../stores/InputCommandStore";


export class PlayerListener implements IEventListener {
    events: GameEvent[];

    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.events = this.createInteractions();
    }

    private createInteractions() {
        const interactions: GameEvent[] = [
            new GameEvent(
                {inputCommand: InputCommand.Forward},
                (gameFacade: GameFacade) => gameFacade.playerMovement.forward()
            ),
            new GameEvent(
                {inputCommand: InputCommand.Backward},
                (gameFacade: GameFacade) => gameFacade.playerMovement.backward()
            ),
            new GameEvent(
                {inputCommand: InputCommand.TurnLeft},
                (gameFacade: GameFacade) => gameFacade.playerMovement.backward()
            ),
            new GameEvent(
                {inputCommand: InputCommand.TurnRight},
                (gameFacade: GameFacade) => gameFacade.playerMovement.right()
            )
        ];

        return interactions;
    }

}