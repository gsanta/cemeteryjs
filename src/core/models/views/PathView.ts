import { View, ViewJson, ViewFactory } from "./View";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";
import { PathPointView, EditPointViewJson } from './child_views/PathPointView';
import { PathObj } from "../objs/PathObj";
import { minBy, maxBy } from "../../../utils/geometry/Functions";
import { Registry } from "../../Registry";
import { UI_SvgCanvas } from "../../ui_components/elements/UI_SvgCanvas";

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

export class PathViewFactory implements ViewFactory {
    viewType = PathViewType;
    newInstance() { return new PathView(); }

    renderInto(canvas: UI_SvgCanvas, pathView: PathView) {
        const group = canvas.group(pathView.id);
        group.isInteractive = false;

        if (pathView.children.length > 1) {
            const highlightPath = group.path();
            highlightPath.d = pathView.serializePath();
            highlightPath.data = pathView;

            highlightPath.css = {
                fill: 'none',
                stroke: 'blue',
                strokeOpacity: pathView.isHovered() || pathView.isSelected() ? 0.5 : 0,
                strokeWidth: "4"
            }

            const path = group.path();
            path.d = pathView.serializePath();

            path.css = {
                fill: 'none',
                stroke: 'black',
                strokeWidth: "2",
                pointerEvents: 'none'
            }
        }

        pathView.children.forEach(editPoint => {
            const circle = group.circle();

            circle.cx = editPoint.point.x;
            circle.cy = editPoint.point.y;
            circle.r = pathView.radius;
            circle.data = editPoint;

            circle.css = {
                fill: pathView.getActiveChild() === editPoint ? 'orange' : (pathView.isHovered() || pathView.isSelected()) ? 'blue' : 'black'
            }
        });
    }
}

export class PathView extends View {
    viewType = PathViewType;

    protected obj: PathObj;
    children: PathPointView[];
    id: string;
    radius = 5;
    str: string;

    getObj(): PathObj {
        return this.obj;
    }

    setObj(obj: PathObj) {
        this.obj = obj;
    }

    addPathPoint(pathPoint: PathPointView) {
        pathPoint.id = `${this.id}-path-point-this.children.length`;
        this.children.push(pathPoint);
        this.bounds = this.calcBoundingBox();
        this.setActiveChild(pathPoint);
        this.update();
    }

    update() {
        this.obj.points = this.children.map(point => point.point.clone().div(10).negateY());
        this.str = undefined;
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

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
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
            this.addPathPoint(epView);
        });

        this.str = undefined;
    }
}