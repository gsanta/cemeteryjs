import { Point } from "../../../utils/geometry/shapes/Point";
import { IObj, ObjFactory } from "./IObj";

export const PathObjType = 'path-obj';

export class PathObjFactory implements ObjFactory {
    objType = PathObjType;
    newInstance() {
        return new PathObj();
    }
}

export class PathObj implements IObj {
    objType = 'path-obj';

    id: string;
    points: Point[] = [];

    dispose() {}

    toJson() {
        return undefined;
    }

    fromJson(json: any) {

    }
}