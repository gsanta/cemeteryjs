import { Stores } from "../../../editor/stores/Stores";
import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { PathConcept } from "../../../editor/views/canvas/models/concepts/PathConcept";
import { PathObject } from "./PathObject";
import { IConceptConverter } from "./IConceptConverter";
import { IGameObject } from "./IGameObject";

export class PathConceptConverter implements IConceptConverter {
    viewType = ConceptType.PathConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    convert(pathView: PathConcept): IGameObject {
        const pathObject = new PathObject();

        pathObject.id = pathView.id;
        pathObject.points = pathView.editPoints.map(p => p.point);
        pathObject.tree = new Map();
        pathView.editPoints.forEach((p, index) => {
            const childIndexes = pathView.childMap.get(p).map(c => pathView.editPoints.indexOf(c));
            pathObject.tree.set(index, childIndexes);
        });

        pathObject.points = pathObject.points.map(p => p.negateY()).map(p => p.div(10));
        pathObject.root = pathObject.points[0];
        this.getStores().gameStore.add(pathObject);

        return pathObject;
    }
}