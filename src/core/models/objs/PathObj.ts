import { Point } from "../../../utils/geometry/shapes/Point";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { AbstractGameObj } from "./AbstractGameObj";
import { IObj, ObjJson } from "./IObj";

export const PathObjType = 'path-obj';

export interface PathObjJson extends ObjJson {
    points: {
        x: number;
        y: number;
    }[];
}

export class PathObj extends AbstractGameObj {
    objType = 'path-obj';

    id: string;
    points: Point[] = [];
    name: string;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        super(canvas);
        this.canvas = canvas;
        
        canvas.data.items.add(this);
    }

    dispose() {}

    clone(): PathObj {
        throw new Error('not implemented');
    }

    setParent(obj: AbstractGameObj): void {
        throw new Error("Method not implemented.");
    }

    getParent(): AbstractGameObj {
        throw new Error("Method not implemented.");
    }

    setScale(scale: Point) {
        throw new Error("Method not implemented.");
    }

    getScale(): Point {
        throw new Error("Method not implemented.");
    }

    setBoundingBoxVisibility(isVisible: boolean) {

    }

    serialize(): PathObjJson {
        const pointsJson = this.points.map(point => ({x: point.x, y: point.y}));

        return {
            id: this.id,
            name: this.name,
            objType: this.objType,
            points: pointsJson
        }
    }

    deserialize(json: PathObjJson) {
        this.id = json.id;
        this.points = json.points.map(point => new Point(point.x, point.y));
        return undefined;
    }
}