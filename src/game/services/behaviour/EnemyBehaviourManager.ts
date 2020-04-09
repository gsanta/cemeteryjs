import { IBehaviour } from "./IBehaviour";
import { IEventListener, IAfterRender } from "../listeners/IEventListener";
import { GameEvent, EventType } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";

export class EnemyBehaviourManager  implements IAfterRender {
    eventType = EventType.AfterRender;
    private behaviours: IBehaviour[];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade, behaviours: IBehaviour[]) {
        this.gameFacade = gameFacade;
        this.behaviours = behaviours;
    }
    
    afterRender() {
        this.gameFacade.stores.gameStore.getEnemies().forEach(enemy => {
            const behaviour = this.behaviours[0]//.find(behaviour => behaviour.type === enemy.activeBehaviour);

            behaviour && behaviour.update(enemy);
        });
    }
}