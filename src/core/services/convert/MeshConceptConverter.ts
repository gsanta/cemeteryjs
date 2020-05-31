import { IGameModel } from "../../models/game_objects/IGameModel";
import { RouteModel } from "../../models/game_objects/RouteModel";
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

    convert(meshConcept: MeshView): IGameModel {
        const meshObject = meshConcept;

        this.registry.stores.gameStore.add(meshObject);

        return meshObject;
    }
}