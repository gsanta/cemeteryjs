import { PathView } from "../views/PathView";
import { IGameObj } from "./IGameObj";

export class PathObj implements IGameObj {
    pathView: PathView;

    id: string;

    constructor(pathView: PathView) {
        this.pathView = pathView;
    }

    toJson() {
        return undefined;
    }

    fromJson(json: any) {

    }
}