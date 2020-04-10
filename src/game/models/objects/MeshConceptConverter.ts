import { MeshObject } from "./MeshObject";
import { GameFacade } from "../../GameFacade";
import { RouteObject } from "./RouteObject";
import { Tools } from "babylonjs";
import { MeshConcept } from "../../../editor/views/canvas/models/concepts/MeshConcept";
import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { Stores } from "../../../editor/stores/Stores";


export class MeshConceptConverter {
    viewType = ConceptType.MeshConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    convert(meshView: MeshConcept): void {
        if (meshView.path) {
            const routeObject = new RouteObject(
                () => this.getStores().gameStore.getByName(meshView.id),
                () => this.getStores().gameStore.getByName(meshView.path)
            );

            routeObject.id = `${meshView.id}-route`;

            this.getStores().gameStore.add(routeObject);
        }

        const meshObject = new MeshObject(
            (meshName: string) => this.getStores().meshStore.getMesh(meshName),
            () => this.getStores().gameStore.getByName(`${meshView.id}-route`)
        );

        meshObject.dimensions = meshView.dimensions.div(10);
        meshObject.type = meshView.type;
        meshObject.meshName = meshView.meshName;
        meshObject.id = meshView.id;
        meshObject.rotation = Tools.ToRadians(meshView.rotation);
        meshObject.texturePath = meshView.texturePath;
        meshObject.modelPath = meshView.modelPath;
        meshObject.thumbnailPath = meshView.thumbnailPath;
        meshObject.path = meshView.path;
        meshObject.color = meshView.color;
        meshObject.scale = meshView.scale;
        meshObject.speed = meshView.speed;
        meshObject.activeBehaviour = meshView.activeBehaviour;
        meshObject.wanderAngle = meshView.wanderAngle;
        meshObject.isManualControl = meshView.isManualControl;

        if (meshView.animationId) {
            meshObject.animation = this.getStores().canvasStore.getAnimationConceptById(meshView.animationId);
        }

        this.getStores().gameStore.add(meshObject);
    }
}