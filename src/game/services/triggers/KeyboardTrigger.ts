import { GameFacade } from '../../GameFacade';
import { ActionManager, ExecuteCodeAction } from 'babylonjs';
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

    private gameFacade: GameFacade;
    private keyCodeToInputCommandMap: Map<KeyCode, GamepadEvent> = new Map(
        [
            [KeyCode.w, GamepadEvent.Forward],
            [KeyCode.s, GamepadEvent.Backward],
            [KeyCode.a, GamepadEvent.TurnLeft],
            [KeyCode.e, GamepadEvent.TurnRight],
        ]
    )

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.gameFacade.gameEngine.scene.actionManager = new ActionManager(this.gameFacade.gameEngine.scene);
        this.registerKeyDown();
    }

    private registerKeyDown() {
        const trigger = {
            trigger: ActionManager.OnKeyDownTrigger
        };

        const handler = (evt) => {
            const command = this.keyCodeToInputCommandMap.get(KeyCode[evt.sourceEvent.key]);
            command && this.gameFacade.gameEventManager.triggerGamepadEvent(command);
        }

        this.gameFacade.gameEngine.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }
}