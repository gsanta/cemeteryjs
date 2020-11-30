import { maxBy, minBy } from "../../../../utils/geometry/Functions";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../core/Registry";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { PathObj, PathObjType } from "../../../../core/models/objs/PathObj";
import { EditPointViewJson, PathPointView } from '../../../../core/models/views/child_views/PathPointView';
import { View, ViewFactoryAdapter, ViewJson, ViewRenderer } from "../../../../core/models/views/View";
import { PathViewRenderer } from "./PathViewRenderer";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export const PathViewType = 'path-view';

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

export class PathView extends View {
    viewType = PathViewType;

    protected obj: PathObj;
    containedViews: PathPointView[];
    id: string;
    radius = 5;
    str: string;

    constructor() {
        super();
        this.renderer = new PathViewRenderer();
    }

    getObj(): PathObj {
        return this.obj;
    }

    setObj(obj: PathObj) {
        this.obj = obj;
    }

    addPathPoint(pathPoint: PathPointView) {
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

        const minX = minBy<PathPointView>(this.containedViews as PathPointView[], (a, b) => a.point.x - b.point.x).point.x;
        const maxX = maxBy<PathPointView>(this.containedViews as PathPointView[], (a, b) => a.point.x - b.point.x).point.x;
        const minY = minBy<PathPointView>(this.containedViews as PathPointView[], (a, b) => a.point.y - b.point.y).point.y;
        const maxY = maxBy<PathPointView>(this.containedViews as PathPointView[], (a, b) => a.point.y - b.point.y).point.y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    deleteContainedView(editPoint: PathPointView): void {
        super.deleteContainedView(editPoint);
        this.str = undefined;
    }

    serializePath() {
        if (this.str) { return this.str; }

        this.str = '';
        
        let pathPoint = <PathPointView> this.containedViews[0];
        this.str += `M ${pathPoint.point.x} ${pathPoint.point.y}`;

        for (let i = 1; i < this.containedViews.length; i++) {
            pathPoint = <PathPointView> this.containedViews[i];
            this.str += `L ${pathPoint.point.x} ${pathPoint.point.y}`;
        }

        return this.str;
    }

    move(point: Point) {
        this.containedViews.forEach((p: PathPointView) => p.point.add(point));

        this.str = undefined;
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    clone(): PathView {
        throw new Error('not implemented')
    }

    toJson(): PathViewJson {
        return {
            ...super.toJson(),
            editPoints: this.containedViews.map(ep => ep.toJson()),
        }
    }

    fromJson(json: PathViewJson, registry: Registry) {
        super.fromJson(json, registry);
        json.editPoints.forEach((ep) => {
            const epView = new PathPointView(this);
            epView.fromJson(ep, registry);
            this.addPathPoint(epView);
        });

        this.str = undefined;
    }
}