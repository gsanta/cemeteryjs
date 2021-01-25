import { PathObj } from "../../../../../core/models/objs/PathObj";
import { AbstractShape, ShapeJson } from "../../../../../core/models/views/AbstractShape";
import { EditPointViewJson, PathPoinShape } from '../../../../../core/models/views/child_views/PathPointShape';
import { Registry } from "../../../../../core/Registry";
import { maxBy, minBy } from "../../../../../utils/geometry/Functions";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { PathShapeRenderer } from "../../renderers/PathShapeRenderer";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export const PathShapeType = 'path-shape';

export interface PathProps {
    editPoints: {
        index: number;
        parent: number;
        point: string;
    }[];
}

export interface PathShapeJson extends ShapeJson {
    editPoints: EditPointViewJson[];
}

export class PathShape extends AbstractShape {
    viewType = PathShapeType;

    protected obj: PathObj;
    containedViews: PathPoinShape[];
    id: string;
    radius = 5;
    str: string;

    constructor() {
        super();
        this.renderer = new PathShapeRenderer();
    }

    getObj(): PathObj {
        return this.obj;
    }

    setObj(obj: PathObj) {
        this.obj = obj;
    }

    addPathPoint(pathPoint: PathPoinShape) {
        pathPoint.id = `${this.id}-path-point-this.children.length`;
        this.containedViews.push(pathPoint);
        this.bounds = this.calcBoundingBox();
        this.setActiveContainedView(pathPoint);
        this.update();
    }

    update() {
        this.obj.points = this.containedViews.map(point => point.point.clone().divX(9.3).divY(10).negateY());
        this.str = undefined;
    }

    private calcBoundingBox() {
        if (this.containedViews.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<PathPoinShape>(this.containedViews as PathPoinShape[], (a, b) => a.point.x - b.point.x).point.x;
        const maxX = maxBy<PathPoinShape>(this.containedViews as PathPoinShape[], (a, b) => a.point.x - b.point.x).point.x;
        const minY = minBy<PathPoinShape>(this.containedViews as PathPoinShape[], (a, b) => a.point.y - b.point.y).point.y;
        const maxY = maxBy<PathPoinShape>(this.containedViews as PathPoinShape[], (a, b) => a.point.y - b.point.y).point.y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    deleteContainedView(editPoint: PathPoinShape): void {
        super.deleteContainedView(editPoint);
        this.str = undefined;
    }

    serializePath() {
        if (this.str) { return this.str; }

        this.str = '';
        
        let pathPoint = <PathPoinShape> this.containedViews[0];
        this.str += `M ${pathPoint.point.x} ${pathPoint.point.y}`;

        for (let i = 1; i < this.containedViews.length; i++) {
            pathPoint = <PathPoinShape> this.containedViews[i];
            this.str += `L ${pathPoint.point.x} ${pathPoint.point.y}`;
        }

        return this.str;
    }

    move(point: Point) {
        this.containedViews.forEach((p: PathPoinShape) => p.point.add(point));

        this.str = undefined;
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    clone(): PathShape {
        throw new Error('not implemented')
    }

    toJson(): PathShapeJson {
        return {
            ...super.toJson(),
            editPoints: this.containedViews.map(ep => ep.toJson()),
        }
    }

    fromJson(json: PathShapeJson, registry: Registry) {
        super.fromJson(json, registry);
        json.editPoints.forEach((ep) => {
            const epView = new PathPoinShape(this);
            epView.fromJson(ep, registry);
            this.addPathPoint(epView);
        });

        this.str = undefined;
    }
}