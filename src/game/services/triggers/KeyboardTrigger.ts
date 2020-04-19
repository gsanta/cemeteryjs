import { ActionManager, ExecuteCodeAction } from 'babylonjs';
import { GamepadEvent } from '../GameEventManager';
import { ServiceLocator } from '../../../editor/services/ServiceLocator';

export enum KeyCode {
    w = 'w',
    a = 'a',
    d = 'd',
    s = 's',
    e = 'e'
}

export class KeyboardTrigger {
    downKeys: Set<string> = new Set();

    private getServices: () => ServiceLocator;
    private keyCodeToInputCommandMap: Map<KeyCode, GamepadEvent> = new Map(
        [
            [KeyCode.w, GamepadEvent.Forward],
            [KeyCode.s, GamepadEvent.Backward],
            [KeyCode.a, GamepadEvent.TurnLeft],
            [KeyCode.e, GamepadEvent.TurnRight],
        ]
    )

    constructor(getServices: () => ServiceLocator) {
        this.getServices = getServices;
        this.getServices().game.gameEngine.scene.actionManager = new ActionManager(this.getServices().game.gameEngine.scene);
        this.registerKeyDown();
    }

    private registerKeyDown() {
        const trigger = {
            trigger: ActionManager.OnKeyDownTrigger
        };

        const handler = (evt) => {
            const command = this.keyCodeToInputCommandMap.get(KeyCode[evt.sourceEvent.key]);
            command && this.getServices().game.gameEventManager.triggerGamepadEvent(command);
        }

        this.getServices().game.gameEngine.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }
}