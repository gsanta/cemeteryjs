import { GameFacade } from '../../../GameFacade';
import { ActionManager, ExecuteCodeAction } from 'babylonjs';

export class KeyboardTrigger {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.gameFacade.scene.actionManager = new ActionManager(this.gameFacade.scene);
    }

    activate() {
        this.registerKeyDown();
        this.registerKeyUp();
    }

    private registerKeyDown() {
        const trigger = {
            trigger: ActionManager.OnKeyDownTrigger
        };

        const handler = (evt) => this.gameFacade.keyboardListener.onKeyDown(evt.sourceEvent.key); 

        this.gameFacade.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }

    private registerKeyUp() {
        const trigger = {
            trigger: ActionManager.OnKeyUpTrigger
        };

        const handler = (evt) => this.gameFacade.keyboardListener.onKeyUp(evt.sourceEvent.key); 

        this.gameFacade.scene.actionManager.registerAction(new ExecuteCodeAction(trigger, handler));
    }
}