import { IViewImporter } from "../../views/canvas/tools/IToolImporter";
import { ViewGroupJson } from "./ImportService";
import { PathConcept } from "../../views/canvas/models/concepts/PathConcept";
import { ConceptType } from "../../views/canvas/models/concepts/Concept";

export interface PathJson {
    circle: {
        _attributes: {
            cx: number;
            cy: number;
            r: number;
        }
    }[];

    path: {
        _attributes: {
            'data-name': string;
            'data-points': string;
            'data-parent-relations': string;
        }
    }
}

export interface PathGroupJson extends ViewGroupJson {
    g: PathJson[] | PathJson;
}

export class PathImporter implements IViewImporter {
    type = ConceptType.Path;
    private addPath: (path: PathConcept) => void;

    constructor(addPath: (path: PathConcept) => void) {
        this.addPath = addPath;
    }

    import(group: PathGroupJson): void {
        const pathJsons =  (<PathJson[]> group.g).length ? <PathJson[]> group.g : [<PathJson> group.g];
        
        pathJsons.forEach(json => {
            const path = new PathConcept();
            path.name = json.path._attributes['data-name'];
            path.deserialize(json.path._attributes['data-points'], json.path._attributes['data-point-relations']);

            this.addPath(path);
        });
    }
}