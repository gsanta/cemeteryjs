import { MeshObject } from "../../models/objects/MeshObject";
import { EventType, GamepadEvent } from "../GameEventManager";
import { IGamepadListener } from "./IEventListener";
import { Stores } from "../../../editor/stores/Stores";
import { ServiceLocator } from "../../../editor/services/ServiceLocator";

export class PlayerListener implements IGamepadListener {
    eventType = EventType.Keyboard;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
    }

    gamepadEvent(gamepadEvent: GamepadEvent) {
        switch(gamepadEvent) {
            case GamepadEvent.Forward:
                this.doAction(this.getServices().game.characterMovement.forward);
            break;
            case GamepadEvent.Backward:
                this.doAction(this.getServices().game.characterMovement.backward);
            break;
            case GamepadEvent.TurnLeft:
                this.doAction(this.getServices().game.characterMovement.left);
            break;
            case GamepadEvent.TurnRight:
                this.doAction(this.getServices().game.characterMovement.right);
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