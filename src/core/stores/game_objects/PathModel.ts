import { PathView } from "../views/PathView";


export class PathModel {
    pathView: PathView;

    constructor(pathView: PathView) {
        this.pathView = pathView;
    }

    getId() {
        return this.pathView.id;
    }
}