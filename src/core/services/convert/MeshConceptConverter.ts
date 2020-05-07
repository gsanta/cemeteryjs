import { Tools } from "babylonjs";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { RouteObject } from "../../../game/models/objects/RouteObject";
import { IConceptConverter } from "./IConceptConverter";
import { ConceptType } from "../../../editor/models/concepts/Concept";
import { Registry } from "../../../editor/Registry";
import { MeshConcept } from "../../../editor/models/concepts/MeshConcept";

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