import { ViewType } from "../../../common/views/View";
import { GameFacade } from "../../GameFacade";
import { MeshView } from "../../../common/views/MeshView";
import { MeshObject } from "./MeshObject";
import { PathObject } from "./PathObject";
import { PathView } from "../../../common/views/PathView";


export class PathViewConverter {
    viewType: ViewType = ViewType.Path;
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    convert(pathView: PathView): void {
        const pathObject = new PathObject();

        pathObject.name = pathView.name;
        pathObject.points = pathView.points;
        pathObject.tree = new Map();
        pathObject.points.forEach(p => {
            const index = pathObject.points.indexOf(p);
            const childIndexes = pathView.edgeList.get(p).map(c => pathObject.points.indexOf(c));
            pathObject.tree.set(index, childIndexes);
        });
        pathObject.root = pathView.rootPoint;
        this.gameFacade.gameStore.add(pathObject);
    }
}