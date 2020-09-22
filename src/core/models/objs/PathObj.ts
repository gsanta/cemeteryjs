import { Point } from "../../../utils/geometry/shapes/Point";
import { PathView } from "../views/PathView";
import { IGameObj } from "./IGameObj";

export class PathObj implements IGameObj {
    pathView: PathView;

    id: string;

    constructor(pathView: PathView) {
        this.pathView = pathView;
    }

    getPoints() {
        return this.pathView.children.map(point => point.point.clone().div(10).negateY());
    }

    dispose() {}

    toJson() {
        return undefined;
    }

    fromJson(json: any) {

    }
}