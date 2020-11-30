import { Point } from "../../../utils/geometry/shapes/Point";
import { IObj, ObjFactoryAdapter, ObjJson } from "./IObj";

export const PathObjType = 'path-obj';

export interface PathObjJson extends ObjJson {
    points: {
        x: number;
        y: number;
    }[];
}

export class PathObjFactory extends ObjFactoryAdapter {
    constructor() {
        super(PathObjType);
    }

    newInstance() {
        return new PathObj();
    }
}

export class PathObj implements IObj {
    objType = 'path-obj';

    id: string;
    points: Point[] = [];

    dispose() {}

    clone(): PathObj {
        throw new Error('not implemented');
    }

    serialize(): PathObjJson {
        const pointsJson = this.points.map(point => ({x: point.x, y: point.y}));

        return {
            id: this.id,
            objType: this.objType,
            points: pointsJson
        }
    }

    deserialize(json: PathObjJson) {
        this.id = json.id;
        this.points = json.points.map(point => new Point(point.x, point.y));
    }
}