import { Sprite } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ILightAdapter } from "../../engine/ILightAdapter";
import { ISpriteAdapter } from "../../engine/ISpriteAdapter";
import { Registry } from "../../Registry";
import { IObj, ObjFactory, ObjJson } from "./IObj";

export const LightObjType = 'light-obj';

export interface LightObjJson extends ObjJson {
    x: number;
    y: number;
    z: number;
    id: string;
}

export class LigthObjFactory implements ObjFactory {
    private registry: Registry;

    objType = LightObjType;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    newInstance() {
        const obj = new LightObj();
        return obj;
    }
}

export class LightObj implements IObj {
    id: string;
    objType = LightObjType;

    lightAdapter: ILightAdapter;

    startPos: Point_3 = new Point_3(0, 5, 0);

    move(point: Point_3) {
        this.startPos.add(point);

        if (this.lightAdapter) {
            this.lightAdapter.setPosition(this, this.lightAdapter.getPosition(this).add(point));
        }
    }

    setPosition(pos: Point_3) {
        this.startPos = pos;

        this.lightAdapter && this.lightAdapter.setPosition(this, pos);
    }

    getPosition(): Point_3 {
        let pos = this.lightAdapter && this.lightAdapter.getPosition(this);

        if (!pos) {
            pos = this.startPos;
        }

        return <Point_3> pos;
    }

    setDirection(dir: Point_3) {
        this.lightAdapter && this.lightAdapter.setDirection(this, dir);
    }

    getDirection(): Point_3 {
        return this.lightAdapter ? this.lightAdapter.getDirection(this) : new Point_3(0, 0, 0);
    }

    getAngle() {
        return this.lightAdapter ? this.lightAdapter.getAngle(this) : 0;
    }

    setAngle(angleRad: number) {
        this.lightAdapter && this.lightAdapter.setAngle(this, angleRad);
    }

    dispose() {
        this.lightAdapter && this.lightAdapter.deleteInstance(this);
    }

    serialize(): LightObjJson {
        return {
            id: this.id,
            objType: this.objType,
            x: this.startPos && this.startPos.x,
            y: this.startPos && this.startPos.y,
            z: this.startPos && this.startPos.z,
        }
    }

    deserialize(json: LightObjJson) {
        if (json.x !== undefined && json.y !== undefined) {
            this.setPosition(new Point_3(json.x, json.y, json.z));
        }
    }
}