import { IViewImporter } from "../../tools/IToolImporter";
import { ViewType } from "../../models/views/View";
import { PathView } from "../../models/views/PathView";
import { ViewGroupJson } from "./ViewImporter";
import { Point } from "../../../../misc/geometry/shapes/Point";

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
    type = ViewType.Path;
    private addPath: (path: PathView) => void;

    constructor(addPath: (path: PathView) => void) {
        this.addPath = addPath;
    }

    import(group: PathGroupJson): void {
        const pathJsons =  (<PathJson[]> group.g).length ? <PathJson[]> group.g : [<PathJson> group.g];
        
        pathJsons.forEach(json => {
            const path = new PathView();
            path.name = json.path._attributes['data-name'];
            path.deserialize(json.path._attributes['data-points'], json.path._attributes['data-point-relations']);

            this.addPath(path);
        });
    }
}