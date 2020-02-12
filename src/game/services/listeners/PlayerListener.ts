import { GameFacade } from "../../GameFacade";
import { GameEvent } from "../GameEventManager";
import { IEventListener } from "./IEventListener";
import { InputCommand } from "../../stores/InputCommandStore";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { MeshObject } from "../../models/objects/MeshObject";

export class PlayerListener implements IEventListener {
    events: GameEvent[];

    private commandToActionMap: Map<InputCommand, (gameFacade: GameFacade) => any>;

    constructor() {
        this.events = this.createInteractions();

        this.commandToActionMap = new Map(
            [
                [InputCommand.Forward, (gameFacade: GameFacade) => this.doAction(gameFacade, gameFacade.characterMovement.forward)],
                [InputCommand.Backward, (gameFacade: GameFacade) => this.doAction(gameFacade, gameFacade.characterMovement.backward)],
                [InputCommand.TurnLeft, (gameFacade: GameFacade) => this.doAction(gameFacade, gameFacade.characterMovement.left)],
                [InputCommand.TurnRight, (gameFacade: GameFacade) => this.doAction(gameFacade, gameFacade.characterMovement.right)],
            ]
        );
    }

    private createInteractions() {
        const interactions: GameEvent[] = [
            new GameEvent(
                {lifeCycleEvent: LifeCycleEvent.AfterRender},
                (gameFacade: GameFacade) => {
                    Array.from(gameFacade.inputCommandStore.commands).forEach(command => {
                        this.commandToActionMap.get(command) && this.commandToActionMap.get(command)(gameFacade);
                    });
                }
            )
        ];

        return interactions;
    }

    private doAction(gameFacade: GameFacade, action: (obj: MeshObject) => void) {
        const player = this.findPlayer(gameFacade);
        player && action(player);
    }

    private findPlayer(gameFacade: GameFacade) {
        return gameFacade.gameStore.getMeshObjects().find(obj => obj.isManualControl);
    }
}