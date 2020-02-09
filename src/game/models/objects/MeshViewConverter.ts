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
        if (gameObject.path) {
            const routeObject = new RouteObject(
                () => this.gameFacade.gameStore.getByName(gameObject.name),
                () => this.gameFacade.gameStore.getByName(gameObject.path)
            );

            routeObject.name = `${gameObject.name}-route`;

            this.gameFacade.gameStore.add(routeObject);
        }

        const meshObject = new MeshObject(
            (meshName: string) => this.gameFacade.meshStore.getMesh(meshName),
            () => this.gameFacade.gameStore.getByName(`${gameObject.name}-route`)
        );

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

        this.gameFacade.gameStore.add(meshObject);
    }
}