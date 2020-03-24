import { MeshObject } from "./MeshObject";
import { GameFacade } from "../../GameFacade";
import { RouteObject } from "./RouteObject";
import { Tools } from "babylonjs";
import { MeshConcept } from "../../../editor/views/canvas/models/concepts/MeshConcept";
import { CanvasItemType } from "../../../editor/views/canvas/models/CanvasItem";


export class MeshConceptConverter {
    viewType: CanvasItemType = CanvasItemType.MeshConcept;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(meshView: MeshConcept): void {
        if (meshView.path) {
            const routeObject = new RouteObject(
                () => this.gameFacade.gameStore.getByName(meshView.name),
                () => this.gameFacade.gameStore.getByName(meshView.path)
            );

            routeObject.name = `${meshView.name}-route`;

            this.gameFacade.gameStore.add(routeObject);
        }

        const meshObject = new MeshObject(
            (meshName: string) => this.gameFacade.meshStore.getMesh(meshName),
            () => this.gameFacade.gameStore.getByName(`${meshView.name}-route`)
        );

        meshObject.dimensions = meshView.dimensions.div(10);
        meshObject.type = meshView.type;
        meshObject.meshName = meshView.meshName;
        meshObject.name = meshView.name;
        meshObject.rotation = Tools.ToRadians(meshView.rotation);
        meshObject.texturePath = meshView.texturePath;
        meshObject.modelPath = meshView.modelPath;
        meshObject.thumbnailPath = meshView.thumbnailPath;
        meshObject.path = meshView.path;
        meshObject.color = meshView.color;
        meshObject.scale = meshView.scale;
        meshObject.speed = meshView.speed;
        meshObject.activeAnimation = meshView.activeAnimation;
        meshObject.activeBehaviour = meshView.activeBehaviour;
        meshObject.wanderAngle = meshView.wanderAngle;
        meshObject.isManualControl = meshView.isManualControl;

        this.gameFacade.gameStore.add(meshObject);
    }
}