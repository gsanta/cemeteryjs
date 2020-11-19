import { Point } from "../../../utils/geometry/shapes/Point";
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
        return new LightObj(this.registry.stores.objStore.generateId(this.objType), this.registry.engine.lights);
    }

    insantiateFromJson(json: LightObjJson): [IObj, AfterAllObjsDeserialized] {
        return LightObj.deserialize(json, this.registry);
    }
}

export class LightObj implements IGameObj {
    id: string;
    objType = LightObjType;

    private lightAdapter: ILightAdapter;

    constructor(id: string, lightAdapter: ILightAdapter) {
        this.lightAdapter = lightAdapter;
        this.id = id;

        this.lightAdapter.setDiffuseColor(this, "#FFFFFF");
        this.lightAdapter.setPosition(this, new Point_3(0, 5, 0));
    }

    private parent: IObj & IGameObj;

    move(point: Point_3) {
        this.lightAdapter.setPosition(this, this.lightAdapter.getPosition(this).add(point));
    }

    setPosition(pos: Point_3) {
        this.lightAdapter.setPosition(this, pos);
    }

    getPosition(): Point_3 {
        return this.lightAdapter.getPosition(this);
    }

    setDirection(dir: Point_3) {
        this.lightAdapter.setDirection(this, dir);
    }

    getDirection(): Point_3 {
        return this.lightAdapter.getDirection(this);
    }

    setScale() {}
    getScale() { return new Point(1, 1); }

    getAngle() {
        return this.lightAdapter.getAngle(this);
    }

    setAngle(angleRad: number) {
        this.lightAdapter.setAngle(this, angleRad);
    }

    setDiffuseColor(color: string) {
        this.lightAdapter.setDiffuseColor(this, color);
    }

    getDiffuseColor(): string {
        return this.lightAdapter.getDiffuseColor(this);
    }

    getLightAdapter(): ILightAdapter {
        return this.lightAdapter;
    }

    setParent(parentObj: IObj & IGameObj) {
        if (this.parent !== parentObj) {
            this.parent = parentObj;
            this.lightAdapter.setParent(this, parentObj);
        }
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
        const pos = this.getPosition();
        const json = <LightObjJson> {
            id: this.id,
            objType: this.objType,
            position: {
                x: pos.x,
                y: pos.y,
                z: pos.z,
            },
            direction: {
                x: direction.x,
                y: direction.y,
                z: direction.z
            },
            diffuseColor: this.getDiffuseColor(),
            parentId: this.parent && this.parent.id
        }

        return json;
    }

    deserialize() {}

    static deserialize(json: LightObjJson, registry: Registry): [IObj, AfterAllObjsDeserialized] {
        const obj = new LightObj(json.id, registry.engine.lights);
        
        obj.setDirection(new Point_3(json.direction.x, json.direction.y, json.direction.z));
        obj.setDiffuseColor(json.diffuseColor);

        const afterAllObjsDeserialized = () => {
            if (json.parentId) {
                const parentPos =  (<MeshObj> registry.stores.objStore.getById(json.parentId)).getPosition();
                const pos = new Point_3(json.position.x, json.position.y, json.position.z).add(parentPos);
                obj.setPosition(pos);
                obj.setParent(<MeshObj> registry.stores.objStore.getById(json.parentId));
                
            } else {
                obj.setPosition(new Point_3(json.position.x, json.position.y, json.position.z));
            }
        }

        return [obj, afterAllObjsDeserialized];   
    }
}