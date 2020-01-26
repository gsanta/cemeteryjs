import { ToolGroupJson } from "../../../../../../world_generator/importers/svg/WorldMapJson";
import { ToolType } from "../Tool";
import { IToolImporter } from "../IToolImporter";
import { SvgCanvasController } from "../../SvgCanvasController";
import { CanvasPath } from "./PathTool";
import { Point } from "../../../../../../model/geometry/shapes/Point";

export interface PathJson {
    circle: {
        cx: number;
        cy: number;
        r: number;
    }[];

    polyline: {
        points: string;
    }
}

export interface PathGroupJson extends ToolGroupJson {
    g: PathJson[] | PathJson;
}

export class PathImporter implements IToolImporter {
    type = ToolType.PATH;
    private addPath: (path: CanvasPath) => void;

    constructor(addPath: (path: CanvasPath) => void) {
        this.addPath = addPath;
    }

    import(group: PathGroupJson): void {
        const pathJsons =  (<PathJson[]> group.g).length ? <PathJson[]> group.g : [<PathJson> group.g];
        
        pathJsons.forEach(json => {
            const points = json.polyline.points
                .split(' ')
                .map((p: string) => {
                    const [x, y] = p.split(',');

                    return new Point(parseInt(x, 10), parseInt(y, 10));
                });

            const path = new CanvasPath();
            path.points = points;

            this.addPath(path);
        });

    }
}