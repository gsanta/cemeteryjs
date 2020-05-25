import { IConceptConverter } from "./IConceptConverter";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { Registry } from "../../Registry";
import { PathView } from "../../models/views/PathView";
import { ConceptType } from "../../models/views/View";

export class PathConceptConverter implements IConceptConverter {
    viewType = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    convert(pathConcept: PathView): IGameObject {
        this.registry.stores.gameStore.add(pathConcept);

        return pathConcept;
    }
}