import { View, ViewType, ViewJson } from "./View";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";
import { PathPointView, EditPointViewJson } from './child_views/PathPointView';
import { IGameModel } from "../game_objects/IGameModel";
import { PathObj } from "../game_objects/PathObj";
import { minBy, maxBy } from "../../../utils/geometry/Functions";
import { Registry } from "../../Registry";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export interface PathProps {
    editPoints: {
        index: number;
        parent: number;
        point: string;
    }[];
}

export interface PathViewJson extends ViewJson {
    editPoints: EditPointViewJson[];
}

export class PathView extends View implements IGameModel {
    viewType = ViewType.PathView;

    obj: PathObj;
    children: PathPointView[];
    dimensions: Rectangle;
    id: string;
    radius = 5;
    str: string;

    constructor() {
        super();
        this.dimensions = this.calcBoundingBox();
        this.obj = new PathObj(this);
    } 

    addEditPoint(editPoint: PathPointView) {
        this.children.push(editPoint);
        this.dimensions = this.calcBoundingBox();
        this.str = undefined;
        this.setActiveChild(editPoint);
    }

    private calcBoundingBox() {
        if (this.children.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<PathPointView>(this.children as PathPointView[], (a, b) => a.point.x - b.point.x).point.x;
        const maxX = maxBy<PathPointView>(this.children as PathPointView[], (a, b) => a.point.x - b.point.x).point.x;
        const minY = minBy<PathPointView>(this.children as PathPointView[], (a, b) => a.point.y - b.point.y).point.y;
        const maxY = maxBy<PathPointView>(this.children as PathPointView[], (a, b) => a.point.y - b.point.y).point.y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    deleteChild(editPoint: PathPointView): void {
        super.deleteChild(editPoint);
        this.str = undefined;
    }

    serializePath() {
        if (this.str) { return this.str; }

        this.str = '';
        
        let pathPoint = <PathPointView> this.children[0];
        this.str += `M ${pathPoint.point.x} ${pathPoint.point.y}`;

        for (let i = 1; i < this.children.length; i++) {
            pathPoint = <PathPointView> this.children[i];
            this.str += `L ${pathPoint.point.x} ${pathPoint.point.y}`;
        }

        return this.str;
    }

    move(point: Point) {
        this.children.forEach((p: PathPointView) => p.point.add(point));

        this.str = undefined;
    }

    dispose() {}

    toJson(): PathViewJson {
        return {
            ...super.toJson(),
            editPoints: this.children.map(ep => ep.toJson()),
        }
    }

    fromJson(json: PathViewJson, registry: Registry) {
        super.fromJson(json, registry);
        json.editPoints.forEach((ep) => {
            const epView = new PathPointView(this);
            epView.fromJson(ep, registry);
            this.addEditPoint(epView);
        });

        this.str = undefined;
    }
}