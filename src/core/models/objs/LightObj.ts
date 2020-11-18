import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ILightAdapter } from "../../engine/ILightAdapter";
import { Registry } from "../../Registry";
import { IGameObj } from "./IGameObj";
import { AfterAllObjsDeserialized, IObj, ObjFactoryAdapter, ObjJson } from "./IObj";
import { MeshObj } from "./MeshObj";

export const LightObjType = 'light-obj';

export interface LightObjJson extends ObjJson {
    direction: {
        x: number;
        y: number;
        z: number;
    }
    position: {
        x: number;
        y: number;
        z: number;
    }
    diffuseColor: string;
    id: string;
    parentId: string;
}

export class LigthObjFactory extends ObjFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super(LightObjType);
        this.registry = registry;
    }

    newInstance() {
        const obj = new LightObj();
        obj.setLightAdapter(this.registry.engine.lights);
        return obj;
    }

    insantiateFromJson(json: LightObjJson): [IObj, AfterAllObjsDeserialized] {
        return LightObj.deserialize(json, this.registry);
    }
}

export class LightObj implements IObj, IGameObj {
    id: string;
    objType = LightObjType;

    private lightAdapter: ILightAdapter;

    startPos: Point_3 = new Point_3(0, 5, 0);
    private startDirection: Point_3 = new Point_3(0, -1, 0);
    private startDiffuseColor: string = "#FFFFFF";
    private startParentMeshId: string;

    private parent: IObj & IGameObj;

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
        return this.lightAdapter.getPosition(this) || this.startPos;
    }

    setDirection(dir: Point_3) {
        this.startDirection = dir;
        this.lightAdapter && this.lightAdapter.setDirection(this, dir);
    }

    getDirection(): Point_3 {
        return this.lightAdapter.getDirection(this) || this.startDirection;
    }

    getAngle() {
        return this.lightAdapter ? this.lightAdapter.getAngle(this) : 0;
    }

    setAngle(angleRad: number) {
        this.lightAdapter && this.lightAdapter.setAngle(this, angleRad);
    }

    setDiffuseColor(color: string) {
        this.startDiffuseColor = color;
        this.lightAdapter && this.lightAdapter.setDiffuseColor(this, color);
    }

    getDiffuseColor(): string {
        return this.lightAdapter.getDiffuseColor(this) || this.startDiffuseColor;
    }

    setLightAdapter(lightAdapter: ILightAdapter) {
        this.lightAdapter = lightAdapter;
        this.lightAdapter.setDiffuseColor(this, this.startDiffuseColor);
        this.lightAdapter.setPosition(this, this.startPos);
        this.lightAdapter.setDiffuseColor(this, this.startDiffuseColor);
    }

    getLightAdapter(): ILightAdapter {
        return this.lightAdapter;
    }

    setParent(parentObj: IObj & IGameObj) {
        this.parent = parentObj;
        this.lightAdapter.setParent(this, parentObj);
    }

    getParent(): IObj & IGameObj {
        return this.parent;
    }

    dispose() {
        this.lightAdapter && this.lightAdapter.deleteInstance(this);
    }
    
    ready() {}

    serialize(): LightObjJson {
        const direction = this.getDirection();
        return {
            id: this.id,
            objType: this.objType,
            position: {
                x: this.startPos && this.startPos.x,
                y: this.startPos && this.startPos.y,
                z: this.startPos && this.startPos.z,
            },
            direction: {
                x: direction.x,
                y: direction.y,
                z: direction.z
            },
            diffuseColor: this.getDiffuseColor(),
            parentId: this.parent && this.parent.id
        }
    }

    deserialize() {}

    static deserialize(json: LightObjJson, registry: Registry): [IObj, AfterAllObjsDeserialized] {     
        const obj = new LightObj();
        obj.setLightAdapter(registry.engine.lights);
        
        obj.setPosition(new Point_3(json.position.x, json.position.y, json.position.z));
        obj.setDirection(new Point_3(json.direction.x, json.direction.y, json.direction.z));
        obj.setDiffuseColor(json.diffuseColor);

        const afterAllObjsDeserialized = () => {
            if (json.parentId) {
                obj.setParent(<MeshObj> registry.stores.objStore.getById(json.parentId));
            }
        }

        return [obj, afterAllObjsDeserialized];   
    }
}