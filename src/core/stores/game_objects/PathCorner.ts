import { Point } from "../../geometry/shapes/Point";

export class PathCorner {
    point1?: Point;
    point2?: Point;
    controlPoint?: Point;
    private allPathCorners: PathCorner[];

    constructor(allPathCorners: PathCorner[]) {
        this.allPathCorners = allPathCorners;
        allPathCorners.push(this);
    }

    getNextCorner(): PathCorner {
        const index = this.allPathCorners.indexOf(this);

        return index === (this.allPathCorners.length - 1) ? undefined : this.allPathCorners[index + 1];
    }

    getPrevCorner(): PathCorner {
        const index = this.allPathCorners.indexOf(this);

        return index === 0 ? undefined : this.allPathCorners[index - 1];
    }
}