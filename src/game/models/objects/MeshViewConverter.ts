import { MeshView } from "../../../common/views/MeshView";
import { MeshObject } from "./MeshObject";
import { GameFacade } from "../../GameFacade";
import { ViewType } from "../../../common/views/View";
import { RouteObject } from "./RouteObject";


export class MeshViewConverter {
    viewType: ViewType = ViewType.GameObject;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(gameObject: MeshView): void {
        const meshObject = new MeshObject((meshName: string) => this.gameFacade.meshStore.getMesh(meshName));

        meshObject.dimensions = gameObject.dimensions;
        meshObject.type = gameObject.type;
        meshObject.meshName = gameObject.meshName;
        meshObject.name = gameObject.name;
        meshObject.rotation = gameObject.rotation;
        meshObject.texturePath = gameObject.texturePath;
        meshObject.modelPath = gameObject.modelPath;
        meshObject.thumbnailPath = gameObject.thumbnailPath;
        meshObject.path = gameObject.path;
        meshObject.color = gameObject.color;
        meshObject.scale = gameObject.scale;
        meshObject.speed = gameObject.speed;
        meshObject.activeAnimation = gameObject.activeAnimation;
        meshObject.activeBehaviour = gameObject.activeBehaviour;
        meshObject.wanderAngle = gameObject.wanderAngle;

        if (gameObject.path) {
            const routeObject = new RouteObject();
            routeObject.meshObjectName = gameObject.name;
            routeObject.pathObjectName = gameObject.path;

            this.gameFacade.gameStore.add(routeObject);
        }

        this.gameFacade.gameStore.add(meshObject);
    }
}