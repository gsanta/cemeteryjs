import { GameFacade } from "../../GameFacade";
import { EventType } from "../GameEventManager";
import { IAfterRender } from "../listeners/IEventListener";
import { IBehaviour } from "./IBehaviour";

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
            const behaviour = this.behaviours[0]

            behaviour && behaviour.update(enemy);
        });
    }
}