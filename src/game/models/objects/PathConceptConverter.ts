import { GameFacade } from "../../GameFacade";
import { PathObject } from "./PathObject";
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

    private createPathTurningPoints(pathObject: PathObject) {
        const mainPoints = pathObject.points;
        pathObject.points = [];
        pathObject.points.push(mainPoints[0]);
        for (let i = 1; i < mainPoints.length - 1; i++) {
            let controlPoint = new Segment(pathObject.points[i - 1], pathObject.points[i]).toVector().mul(0.9);
            pathObject.points.push(mainPoints[i].add(controlPoint));
            pathObject.turningPoints.add(controlPoint);
            pathObject.points.push(mainPoints[i]);
            controlPoint = new Segment(pathObject.points[i], pathObject.points[i + 1]).toVector().mul(0.1);
            pathObject.turningPoints.add(controlPoint);
        }
        pathObject.points.push(mainPoints[mainPoints.length - 1]);
    }
}