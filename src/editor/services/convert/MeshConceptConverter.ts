import { Tools } from "babylonjs";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { RouteObject } from "../../../game/models/objects/RouteObject";
import { ConceptType } from "../../models/concepts/Concept";
import { MeshConcept } from "../../models/concepts/MeshConcept";
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

        const meshObject = meshConcept;

        if (meshConcept.animationId) {
            meshObject.animation = this.registry.stores.canvasStore.getAnimationConceptById(meshConcept.animationId);
        }

        this.registry.stores.gameStore.add(meshObject);

        return meshObject;
    }
}