import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeJson } from "../../../../../core/models/shapes/AbstractShape";
import { EditPointViewJson, PathPoinShape } from '../../../../../core/models/shapes/child_views/PathPointShape';
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
    containedShapes: PathPoinShape[];
    id: string;
    radius = 5;
    str: string;

    constructor(obj: PathObj, canvas: Canvas2dPanel) {
        super(canvas);
        this.setObj(obj);
        this.renderer = new PathShapeRenderer();

        canvas.data.items.addItem(this);
    }

    getObj(): PathObj {
        return this.obj;
    }

    setObj(obj: PathObj) {
        this.obj = obj;
    }

    addPathPoint(pathPoint: PathPoinShape) {
        pathPoint.id = `${this.id}-path-point-this.children.length`;
        this.containedShapes.push(pathPoint);
        this.bounds = this.calcBoundingBox();
        this.setActiveContainedView(pathPoint);
        this.update();
    }

    update() {
        this.obj.points = this.containedShapes.map(point => point.point.clone().divX(9.3).divY(10).negateY());
        this.str = undefined;
    }

    private calcBoundingBox() {
        if (this.containedShapes.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<PathPoinShape>(this.containedShapes as PathPoinShape[], (a, b) => a.point.x - b.point.x).point.x;
        const maxX = maxBy<PathPoinShape>(this.containedShapes as PathPoinShape[], (a, b) => a.point.x - b.point.x).point.x;
        const minY = minBy<PathPoinShape>(this.containedShapes as PathPoinShape[], (a, b) => a.point.y - b.point.y).point.y;
        const maxY = maxBy<PathPoinShape>(this.containedShapes as PathPoinShape[], (a, b) => a.point.y - b.point.y).point.y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    deleteContainedView(editPoint: PathPoinShape): void {
        super.deleteContainedView(editPoint);
        this.str = undefined;
    }

    serializePath() {
        if (this.str) { return this.str; }

        this.str = '';
        
        let pathPoint = <PathPoinShape> this.containedShapes[0];
        this.str += `M ${pathPoint.point.x} ${pathPoint.point.y}`;

        for (let i = 1; i < this.containedShapes.length; i++) {
            pathPoint = <PathPoinShape> this.containedShapes[i];
            this.str += `L ${pathPoint.point.x} ${pathPoint.point.y}`;
        }

        return this.str;
    }

    move(point: Point) {
        this.containedShapes.forEach((p: PathPoinShape) => p.point.add(point));

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
            editPoints: this.containedShapes.map(ep => ep.toJson()),
        }
    }

    static fromJson(json: PathShapeJson, obj: PathObj, canvas: Canvas2dPanel): [AbstractShape, AfterAllViewsDeserialized] {
        const pathShape = new PathShape(obj, canvas);
        json.editPoints.forEach((ep) => {
            const epView = new PathPoinShape(pathShape);
            epView.fromJson(ep);
            pathShape.addPathPoint(epView);
        });

        pathShape.str = undefined;
        return [pathShape, undefined];
    }
}