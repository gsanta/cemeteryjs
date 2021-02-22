import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { ILightAdapter } from "../../engine/ILightAdapter";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { ObjObservable } from "../ObjObservable";
import { AbstractGameObj } from "./AbstractGameObj";
import { AfterAllObjsDeserialized, IObj, ObjJson } from "./IObj";
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

export class LightObj extends AbstractGameObj {
    objType = LightObjType;
    id: string;
    name: string;
    canvas: Canvas3dPanel;
    observable: ObjObservable;

    private lightAdapter: ILightAdapter;

    constructor(canvas: Canvas3dPanel) {
        super(canvas);
        this.canvas = canvas;
        this.lightAdapter = canvas.engine.lights;
        this.observable = new ObjObservable();
        this.canvas.data.items.add(this);

        this.lightAdapter.createInstance(this);
        this.lightAdapter.setDiffuseColor(this, "#FFFFFF");
        this.lightAdapter.setPosition(this, new Point_3(0, 5, 0));
    }

    private parent: AbstractGameObj;

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

    setParent(parentObj: AbstractGameObj) {
        if (this.parent !== parentObj) {
            this.parent = parentObj;
            this.lightAdapter.setParent(this, parentObj);
        }
    }

    getParent(): AbstractGameObj {
        return this.parent;
    }

    setBoundingBoxVisibility(isVisible: boolean) {
        throw new Error("Method not implemented.");
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

    clone(): LightObj { throw new Error('Not implemented'); }

    deserialize(json: LightObjJson): AfterAllObjsDeserialized {
        this.id = json.id;
        
        this.setDirection(new Point_3(json.direction.x, json.direction.y, json.direction.z));
        this.setDiffuseColor(json.diffuseColor);

        const afterAllObjsDeserialized = () => {
            if (json.parentId) {
                const parentPos =  (<MeshObj> this.canvas.data.items.getById(json.parentId)).getPosition();
                const pos = new Point_3(json.position.x, json.position.y, json.position.z).add(parentPos);
                this.setPosition(pos);
                this.setParent(<MeshObj> this.canvas.data.items.getById(json.parentId));
                
            } else {
                this.setPosition(new Point_3(json.position.x, json.position.y, json.position.z));
            }
        }

        return afterAllObjsDeserialized;   
    }
}