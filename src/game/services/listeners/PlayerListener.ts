import { GameFacade } from "../../GameFacade";
import { GameEvent } from "../GameEventManager";
import { IEventListener } from "./IEventListener";
import { InputCommand } from "../../stores/InputCommandStore";


export class PlayerListener implements IEventListener {
    events: GameEvent[];

    private commandToActionMap: Map<InputCommand, (gameFacade: GameFacade) => any>;

    constructor() {
        this.events = this.createInteractions();

        this.commandToActionMap = new Map(
            [
                [InputCommand.Forward, (gameFacade: GameFacade) => gameFacade.playerMovement.forward()],
                [InputCommand.Backward, (gameFacade: GameFacade) => gameFacade.playerMovement.backward()],
                [InputCommand.TurnLeft, (gameFacade: GameFacade) => gameFacade.playerMovement.left()],
                [InputCommand.TurnRight, (gameFacade: GameFacade) => gameFacade.playerMovement.right()],
            ]
        );
    }

    private createInteractions() {
        const interactions: GameEvent[] = [
            new GameEvent(
                {isAfterRender: true},
                (gameFacade: GameFacade) => {
                    Array.from(gameFacade.inputCommandStore.commands).forEach(command => {
                        this.commandToActionMap.get(command) && this.commandToActionMap.get(command)(gameFacade);
                    });
                }
            ),
            // new GameEvent(
            //     {inputCommand: InputCommand.Forward},
            //     (gameFacade: GameFacade) => gameFacade.playerMovement.forward()
            // ),
            // new GameEvent(
            //     {inputCommand: InputCommand.Backward},
            //     (gameFacade: GameFacade) => gameFacade.playerMovement.backward()
            // ),
            // new GameEvent(
            //     {inputCommand: InputCommand.TurnLeft},
            //     (gameFacade: GameFacade) => gameFacade.playerMovement.left()
            // ),
            // new GameEvent(
            //     {inputCommand: InputCommand.TurnRight},
            //     (gameFacade: GameFacade) => gameFacade.playerMovement.right()
            // )
        ];

        return interactions;
    }

}