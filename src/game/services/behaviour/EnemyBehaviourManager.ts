import { IBehaviour } from "./IBehaviour";
import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";

export class EnemyBehaviourManager  implements IEventListener {
    events: GameEvent[];
    private behaviours: IBehaviour[];
    private gameFacade: GameFacade;
    private behaviourTimeouts: Map<MeshObject, number> = new Map();

    constructor(gameFacade: GameFacade, behaviours: IBehaviour[]) {
        this.gameFacade = gameFacade;
        this.behaviours = behaviours;
        this.updateBehaviours = this.updateBehaviours.bind(this);

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateBehaviours)
        ]
    }
    
    private updateBehaviours() {
        this.gameFacade.gameStore.getEnemies().forEach(enemy => {
            const behaviour = this.behaviours[0]//.find(behaviour => behaviour.type === enemy.activeBehaviour);

            behaviour && behaviour.update(enemy);
        });
    }
}