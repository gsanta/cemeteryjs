import { IGameObject } from "../../../game/models/objects/IGameObject";
import { RouteObject } from "../../../game/models/objects/RouteObject";
import { IConceptConverter } from "./IConceptConverter";
import { Registry } from "../../Registry";
import { MeshView } from "../../models/views/MeshView";
import { ConceptType } from "../../models/views/View";

export class MeshConceptConverter implements IConceptConverter {
    viewType = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    convert(meshConcept: MeshView): IGameObject {
        const meshObject = meshConcept;

        this.registry.stores.gameStore.add(meshObject);

        return meshObject;
    }
}