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
        pathObject.points = pathView.points.map(p => p.negateY());

        this.gameFacade.gameStore.add(pathObject);
    }
}