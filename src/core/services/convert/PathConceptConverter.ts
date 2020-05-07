import { IConceptConverter } from "./IConceptConverter";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { ConceptType } from "../../../editor/models/concepts/Concept";
import { Registry } from "../../../editor/Registry";
import { PathConcept } from "../../../editor/models/concepts/PathConcept";

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