import { Registry } from "../../../editor/Registry";
import { EventType, GamepadEvent } from "../GameEventManager";
import { IGamepadListener } from "./IEventListener";
import { MeshConcept } from "../../../editor/views/canvas/models/concepts/MeshConcept";

export class PlayerListener implements IGamepadListener {
    eventType = EventType.Keyboard;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    gamepadEvent(gamepadEvent: GamepadEvent) {
        // switch(gamepadEvent) {
        //     case GamepadEvent.Forward:
        //         this.doAction(this.registry.services.game.characterMovement.forward);
        //     break;
        //     case GamepadEvent.Backward:
        //         this.doAction(this.registry.services.game.characterMovement.backward);
        //     break;
        //     case GamepadEvent.TurnLeft:
        //         this.doAction(this.registry.services.game.characterMovement.left);
        //     break;
        //     case GamepadEvent.TurnRight:
        //         this.doAction(this.registry.services.game.characterMovement.right);
        //     break;
        // }
    }

    private doAction(action: (obj: MeshConcept) => void) {
        const player = this.findPlayer();
        player && action(player);
    }

    private findPlayer() {
        return this.registry.stores.gameStore.getMeshObjects().find(obj => obj.isManualControl);
    }
}