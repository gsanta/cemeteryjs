import { GameFacade } from '../../GameFacade';
import { ActionManager, ExecuteCodeAction } from 'babylonjs';
import { InputCommand } from '../../stores/InputCommandStore';

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
    private triggerFunc: (isAfterRender?: boolean) => void

    private keyCodeToInputCommandMap: Map<KeyCode, InputCommand> = new Map(
        [
            [KeyCode.w, InputCommand.Forward],
            [KeyCode.s, InputCommand.Backward],
            [KeyCode.a, InputCommand.TurnLeft],
            [KeyCode.e, InputCommand.TurnRight],
        ]
    )

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.gameFacade.gameEngine.scene.actionManager = new ActionManager(this.gameFacade.gameEngine.scene);
        this.registerKeyDown();
        this.registerKeyUp();
    }

    activate(triggerFunc: (isAfterRender: boolean) => void) {
        this.triggerFunc = triggerFunc;
    }

    private registerKeyDown() {
        const trigger = {
            trigger: ActionManager.OnKeyDownTrigger
        };

        const handler = (evt) => {
            const command = this.keyCodeToInputCommandMap.get(KeyCode[evt.sourceEvent.key]);
            command && this.gameFacade.inputCommandStore.commands.add(command);
            this.triggerFunc();
        }

        this.gameFacade.gameEngine.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }

    private registerKeyUp() {
        const trigger = {
            trigger: ActionManager.OnKeyUpTrigger
        };

        const handler = (evt) => {
            const command = this.keyCodeToInputCommandMap.get(evt.sourceEvent.key);
            command && this.gameFacade.inputCommandStore.commands.delete(command);
            this.triggerFunc();
        }

        this.gameFacade.gameEngine.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }
}