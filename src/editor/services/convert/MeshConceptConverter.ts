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

    convert(meshConcept: MeshConcept): IGameObject {
        if (meshConcept.path) {
            const routeObject = new RouteObject(
                () => this.registry.stores.gameStore.getByName(meshConcept.id),
                () => this.registry.stores.gameStore.getByName(meshConcept.path)
            );

            routeObject.id = `${meshConcept.id}-route`;

            this.registry.stores.gameStore.add(routeObject);
        }

        const meshObject = new MeshObject(() => this.registry.stores.gameStore.getByName(`${meshConcept.id}-route`));

        meshObject.dimensions = meshConcept.dimensions.div(10);
        meshObject.meshName = meshConcept.meshName;
        meshObject.id = meshConcept.id;
        meshObject.rotation = Tools.ToRadians(meshConcept.rotation);
        const modelConcept = this.registry.stores.canvasStore.getModelConceptById(meshConcept.modelId);
        meshObject.texturePath = modelConcept && modelConcept.texturePath;
        meshObject.modelId = meshConcept.modelId;

        meshObject.thumbnailPath = meshConcept.thumbnailPath;
        meshObject.path = meshConcept.path;
        meshObject.color = meshConcept.color;
        meshObject.scale = meshConcept.scale;
        meshObject.speed = meshConcept.speed;
        meshObject.activeBehaviour = meshConcept.activeBehaviour;
        meshObject.wanderAngle = meshConcept.wanderAngle;
        meshObject.isManualControl = meshConcept.isManualControl;

        if (meshConcept.animationId) {
            meshObject.animation = this.registry.stores.canvasStore.getAnimationConceptById(meshConcept.animationId);
        }

        this.registry.stores.gameStore.add(meshObject);

        return meshObject;
    }
}