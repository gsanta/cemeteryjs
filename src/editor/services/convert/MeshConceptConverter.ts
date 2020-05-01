import { Tools } from "babylonjs";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { MeshObject } from "../../../game/models/objects/MeshObject";
import { RouteObject } from "../../../game/models/objects/RouteObject";
import { Stores } from "../../stores/Stores";
import { ConceptType } from "../../views/canvas/models/concepts/Concept";
import { MeshConcept } from "../../views/canvas/models/concepts/MeshConcept";
import { IConceptConverter } from "./IConceptConverter";
import { Registry } from "../../Registry";

export class MeshConceptConverter implements IConceptConverter {
    viewType = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    convert(meshView: MeshConcept): IGameObject {
        if (meshView.path) {
            const routeObject = new RouteObject(
                () => this.registry.stores.gameStore.getByName(meshView.id),
                () => this.registry.stores.gameStore.getByName(meshView.path)
            );

            routeObject.id = `${meshView.id}-route`;

            this.registry.stores.gameStore.add(routeObject);
        }

        const meshObject = new MeshObject(() => this.registry.stores.gameStore.getByName(`${meshView.id}-route`));

        meshObject.dimensions = meshView.dimensions.div(10);
        meshObject.meshName = meshView.meshName;
        meshObject.id = meshView.id;
        meshObject.rotation = Tools.ToRadians(meshView.rotation);
        const modelConcept = this.registry.stores.canvasStore.getModelConceptById(meshView.modelId);
        meshObject.texturePath = modelConcept && modelConcept.texturePath;
        meshObject.modelPath = modelConcept && modelConcept.modelPath;

        meshObject.thumbnailPath = meshView.thumbnailPath;
        meshObject.path = meshView.path;
        meshObject.color = meshView.color;
        meshObject.scale = meshView.scale;
        meshObject.speed = meshView.speed;
        meshObject.activeBehaviour = meshView.activeBehaviour;
        meshObject.wanderAngle = meshView.wanderAngle;
        meshObject.isManualControl = meshView.isManualControl;

        if (meshView.animationId) {
            meshObject.animation = this.registry.stores.canvasStore.getAnimationConceptById(meshView.animationId);
        }

        this.registry.stores.gameStore.add(meshObject);

        return meshObject;
    }
}