import { GameFacade } from "../../GameFacade";
import { EventType } from "../GameEventManager";
import { IAfterRender } from "../listeners/IEventListener";
import { IBehaviour } from "./IBehaviour";
import { Stores } from "../../../editor/stores/Stores";

export class EnemyBehaviourManager  implements IAfterRender {
    eventType = EventType.AfterRender;
    private behaviours: IBehaviour[];
    private getStores: () => Stores;

    constructor(getStores: () => Stores, behaviours: IBehaviour[]) {
        this.getStores = getStores;
        this.behaviours = behaviours;
    }
    
    afterRender() {
        this.getStores().gameStore.getEnemies().forEach(enemy => {
            const behaviour = this.behaviours[0]

            behaviour && behaviour.update(enemy);
        });
    }
}