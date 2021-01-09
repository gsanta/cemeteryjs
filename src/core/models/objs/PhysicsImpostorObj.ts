import { IPhysicsAdapter } from "../../engine/IPhysicsAdapter";
import { Registry } from "../../Registry";
import { IObj, ObjFactoryAdapter, ObjJson } from "./IObj";

export const PhysicsImpostorObjType = 'physics-impostor-obj';

export interface PhysicsImpostorObjJson extends ObjJson {
    mass: number;
}

export class PhysicsImpostorObjFactory extends ObjFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super(PhysicsImpostorObjType);

        this.registry = registry;
    }

    newInstance() {
        return new PhysicsImpostorObj(this.registry.engine.physics);
    }
}

export class PhysicsImpostorObj implements IObj {
    objType = PhysicsImpostorObjType;
    id: string;
    name: string;
    mass: number = 1;

    private physicsAdapter: IPhysicsAdapter;

    constructor(physicsAdapter: IPhysicsAdapter) {
        this.physicsAdapter = physicsAdapter;
    }

    dispose(): void {
        throw new Error("Method not implemented.");
    }

    serialize(): PhysicsImpostorObjJson {
        return {
            objType: this.objType,
            id: this.id,
            name: this.name,
            mass: this.mass
        }
    }

    deserialize(json: PhysicsImpostorObjJson) {
        this.id = json.id;
        this.name = json.name;
        this.mass = json.mass;
    }

    clone(): IObj {
        const clone = new PhysicsImpostorObj(this.physicsAdapter);
        clone.mass = this.mass;
        return clone;
    }
}