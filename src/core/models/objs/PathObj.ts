import { Point } from "../../../utils/geometry/shapes/Point";
import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { IObj, ObjFactoryAdapter, ObjJson } from "./IObj";

export const PathObjType = 'path-obj';

export interface PathObjJson extends ObjJson {
    points: {
        x: number;
        y: number;
    }[];
}

export class PathObjFactory extends ObjFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super(PathObjType);
        this.registry = registry;
    }

    newInstance() {
        return new PathObj(this.registry.services.module.ui.sceneEditor);
    }
}

export class PathObj implements IObj {
    objType = 'path-obj';

    id: string;
    points: Point[] = [];
    name: string;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
    }

    dispose() {}

    clone(): PathObj {
        throw new Error('not implemented');
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
    }
}