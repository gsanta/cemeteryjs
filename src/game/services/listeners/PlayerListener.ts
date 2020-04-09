import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";
import { InputCommand } from "../../stores/InputCommandStore";
import { EventType, GamepadEvent } from "../GameEventManager";
import { IGamepadListener } from "./IEventListener";

export class PlayerListener implements IGamepadListener {
    eventType = EventType.Keyboard;

    private commandToActionMap: Map<InputCommand, (gameFacade: GameFacade) => any>;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    gamepadEvent(gamepadEvent: GamepadEvent) {
        switch(gamepadEvent) {
            case GamepadEvent.Forward:
                this.doAction(this.gameFacade, this.gameFacade.characterMovement.forward);
            break;
            case GamepadEvent.Backward:
                this.doAction(this.gameFacade, this.gameFacade.characterMovement.backward);
            break;
            case GamepadEvent.TurnLeft:
                this.doAction(this.gameFacade, this.gameFacade.characterMovement.left);
            break;
            case GamepadEvent.TurnRight:
                this.doAction(this.gameFacade, this.gameFacade.characterMovement.right);
            break;
        }
    }

    private doAction(gameFacade: GameFacade, action: (obj: MeshObject) => void) {
        const player = this.findPlayer(gameFacade);
        player && action(player);
    }

    private findPlayer(gameFacade: GameFacade) {
        return gameFacade.stores.gameStore.getMeshObjects().find(obj => obj.isManualControl);
    }
}