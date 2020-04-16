import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";
import { EventType, GamepadEvent } from "../GameEventManager";
import { IGamepadListener } from "./IEventListener";
import { Stores } from "../../../editor/stores/Stores";

export class PlayerListener implements IGamepadListener {
    eventType = EventType.Keyboard;

    private gameFacade: GameFacade;
    private getStores: () => Stores;

    constructor(gameFacade: GameFacade, getStores: () => Stores) {
        this.gameFacade = gameFacade;
        this.getStores = getStores;
    }

    gamepadEvent(gamepadEvent: GamepadEvent) {
        switch(gamepadEvent) {
            case GamepadEvent.Forward:
                this.doAction(this.gameFacade.characterMovement.forward);
            break;
            case GamepadEvent.Backward:
                this.doAction(this.gameFacade.characterMovement.backward);
            break;
            case GamepadEvent.TurnLeft:
                this.doAction(this.gameFacade.characterMovement.left);
            break;
            case GamepadEvent.TurnRight:
                this.doAction(this.gameFacade.characterMovement.right);
            break;
        }
    }

    private doAction(action: (obj: MeshObject) => void) {
        const player = this.findPlayer();
        player && action(player);
    }

    private findPlayer() {
        return this.getStores().gameStore.getMeshObjects().find(obj => obj.isManualControl);
    }
}