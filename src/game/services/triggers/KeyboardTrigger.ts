import { ActionManager, ExecuteCodeAction } from 'babylonjs';
import { Registry } from '../../../editor/Registry';
import { GamepadEvent } from '../GameEventManager';

export enum KeyCode {
    w = 'w',
    a = 'a',
    d = 'd',
    s = 's',
    e = 'e'
}

export class KeyboardTrigger {
    downKeys: Set<string> = new Set();

    private registry: Registry;
    private keyCodeToInputCommandMap: Map<KeyCode, GamepadEvent> = new Map(
        [
            [KeyCode.w, GamepadEvent.Forward],
            [KeyCode.s, GamepadEvent.Backward],
            [KeyCode.a, GamepadEvent.TurnLeft],
            [KeyCode.e, GamepadEvent.TurnRight],
        ]
    )

    constructor(registry: Registry) {
        this.registry = registry;
        this.registry.services.game.gameEngine.scene.actionManager = new ActionManager(this.registry.services.game.gameEngine.scene);
        this.registerKeyDown();
    }

    private registerKeyDown() {
        const trigger = {
            trigger: ActionManager.OnKeyDownTrigger
        };

        const handler = (evt) => {
            const command = this.keyCodeToInputCommandMap.get(KeyCode[evt.sourceEvent.key]);
            command && this.registry.services.game.gameEventManager.triggerGamepadEvent(command);
        }

        this.registry.services.game.gameEngine.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }
}