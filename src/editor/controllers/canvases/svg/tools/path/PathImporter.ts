import { Point } from "../../../../../../model/geometry/shapes/Point";
import { ViewGroupJson } from "../../../../../../world_generator/importers/svg/WorldMapJson";
import { IViewImporter } from "../IToolImporter";
import { ToolType } from "../Tool";
import { PathView } from "./PathTool";
import { ViewType } from "../../../../../../model/View";

export interface PathJson {
    circle: {
        _attributes: {
            cx: number;
            cy: number;
            r: number;
        }
    }[];

    polyline: {
        _attributes: {
            points: string;
            'data-name': string;
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
            const points = json.polyline._attributes.points
                .split(' ')
                .map((p: string) => {
                    const [x, y] = p.split(',');

                    return new Point(parseInt(x, 10), parseInt(y, 10));
                });

            const path = new PathView();
            path.name = json.polyline._attributes['data-name'];
            path.points = points;

            this.addPath(path);
        });
    }
}