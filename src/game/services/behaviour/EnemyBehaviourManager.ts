import { IBehaviour } from "./IBehaviour";
import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { MeshView } from "../../../common/views/MeshView";
import { MeshObject } from "../../models/objects/MeshObject";

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