import { IBehaviour } from "./IBehaviour";
import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { GameObject } from "../../../world_generator/services/GameObject";

export class EnemyBehaviourManager  implements IEventListener {
    events: GameEvent[];
    private behaviours: IBehaviour[];
    private gameFacade: GameFacade;
    private behaviourTimeouts: Map<GameObject, number> = new Map();

    constructor(gameFacade: GameFacade, behaviours: IBehaviour[]) {
        this.gameFacade = gameFacade;
        this.behaviours = behaviours;
        this.updateBehaviours = this.updateBehaviours.bind(this);

        this.events = [
            new GameEvent({isAfterRender: true}, this.updateBehaviours)
        ]
    }
    
    private updateBehaviours() {
        this.gameFacade.gameObjectStore.getEnemies().forEach(enemy => {
            const behaviour = this.behaviours[0]//.find(behaviour => behaviour.type === enemy.activeBehaviour);

            behaviour && behaviour.update(enemy);
        });
    }
}