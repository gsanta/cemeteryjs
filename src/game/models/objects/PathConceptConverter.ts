import { GameFacade } from "../../GameFacade";
import { PathObject, PathCorner } from "./PathObject";
import { PathConcept } from "../../../editor/views/canvas/models/concepts/PathConcept";
import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { Segment } from "../../../misc/geometry/shapes/Segment";

export class PathConceptConverter {
    viewType = ConceptType.PathConcept;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(pathView: PathConcept): void {
        const pathObject = new PathObject();

        pathObject.id = pathView.id;
        pathObject.points = pathView.editPoints.map(p => p.point);
        pathObject.tree = new Map();
        pathView.editPoints.forEach((p, index) => {
            const childIndexes = pathView.childMap.get(p).map(c => pathView.editPoints.indexOf(c));
            pathObject.tree.set(index, childIndexes);
        });

        pathObject.points = pathObject.points.map(p => p.negateY()).map(p => p.div(10));
        this.createPathTurningPoints(pathObject);

        pathObject.root = pathObject.points[0];
        this.gameFacade.gameStore.add(pathObject);
    }
}