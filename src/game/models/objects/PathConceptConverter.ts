import { GameFacade } from "../../GameFacade";
import { PathObject } from "./PathObject";
import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { PathConcept } from "../../../editor/views/canvas/models/concepts/PathConcept";


export class PathConceptConverter {
    viewType: ConceptType = ConceptType.Path;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(pathView: PathConcept): void {
        const pathObject = new PathObject();

        pathObject.name = pathView.name;
        pathObject.points = pathView.points;
        pathObject.tree = new Map();
        pathView.points.forEach((p, index) => {
            const childIndexes = pathView.childMap.get(p).map(c => pathObject.points.indexOf(c));
            pathObject.tree.set(index, childIndexes);
        });
        pathObject.points = pathObject.points.map(p => p.negateY()).map(p => p.div(10));
        pathObject.root = pathObject.points[0];
        this.gameFacade.gameStore.add(pathObject);
    }
}