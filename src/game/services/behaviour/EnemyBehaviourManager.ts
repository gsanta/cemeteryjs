import { EventType } from "../GameEventManager";
import { IAfterRender } from "../listeners/IEventListener";
import { IBehaviour } from "./IBehaviour";
import { Stores } from "../../../core/stores/Stores";
import { Registry } from "../../../core/Registry";

export class EnemyBehaviourManager  implements IAfterRender {
    eventType = EventType.AfterRender;
    private behaviours: IBehaviour[];
    private registry: Registry;

    constructor(registry: Registry, behaviours: IBehaviour[]) {
        this.registry = registry;
        this.behaviours = behaviours;
    }
    
    afterRender() {
        this.registry.stores.gameStore.getEnemies().forEach(enemy => {
            const behaviour = this.behaviours[0]

            behaviour && behaviour.update(enemy);
        });
    }
}