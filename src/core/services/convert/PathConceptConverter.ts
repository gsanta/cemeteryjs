import { IConceptConverter } from "./IConceptConverter";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { Registry } from "../../Registry";
import { PathConcept } from "../../models/concepts/PathConcept";
import { ConceptType } from "../../models/concepts/Concept";

export class PathConceptConverter implements IConceptConverter {
    viewType = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    convert(pathConcept: PathConcept): IGameObject {

        // pathObject.points = pathView.editPoints.map(p => p.point);

        // pathObject.points = pathObject.points.map(p => p)//.map(p => p.div(10));
        this.registry.stores.gameStore.add(pathConcept);

        return pathConcept;
    }
}