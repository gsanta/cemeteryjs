import { GameFacade } from "../../GameFacade";
import { IEventListener } from "./IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameObject, AnimationName } from "../../../world_generator/services/GameObject";


export class AnimationPlayer implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private playingAnimations: Map<GameObject, AnimationName> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateAnimations = this.updateAnimations.bind(this);

        this.events = [
            new GameEvent({isAfterRender: true}, this.updateAnimations)
        ]
    }

    private updateAnimations() {

    }
}