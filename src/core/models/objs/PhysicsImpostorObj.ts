import { IPhysicsAdapter } from "../../engine/IPhysicsAdapter";
import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { IObj, ObjFactoryAdapter, ObjJson } from "./IObj";

export const PhysicsImpostorObjType = 'physics-impostor-obj';

export interface PhysicsImpostorObjJson extends ObjJson {
    mass: number;
    friction: number;
    restitution: number;
}

export class PhysicsImpostorObjFactory extends ObjFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super(PhysicsImpostorObjType);

        this.registry = registry;
    }

    newInstance() {
        return new PhysicsImpostorObj(this.registry.services.module.ui.sceneEditor);
    }
}

export class PhysicsImpostorObj implements IObj {
    objType = PhysicsImpostorObjType;
    id: string;
    name: string;
    mass: number = 1;
    friction = 0.9;
    restitution = 0.2;
    canvas: Canvas3dPanel;

    private physicsAdapter: IPhysicsAdapter;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
        this.physicsAdapter = this.canvas.engine.physics;
    }

    dispose(): void {
    }

    serialize(): PhysicsImpostorObjJson {
        return {
            objType: this.objType,
            id: this.id,
            name: this.name,
            mass: this.mass,
            friction: this.friction,
            restitution: this.restitution
        }
    }

    deserialize(json: PhysicsImpostorObjJson) {
        this.id = json.id;
        this.name = json.name;
        this.mass = json.mass;
        this.friction= json.friction;
        this.restitution = json.restitution;
    }

    clone(): IObj {
        const clone = new PhysicsImpostorObj(this.canvas);
        clone.mass = this.mass;
        return clone;
    }
}