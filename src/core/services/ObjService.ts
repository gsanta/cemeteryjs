import { AssetObjFactory } from "../models/objs/AssetObj";
import { IObj, ObjFactory } from "../models/objs/IObj";
import { LigthObjFactory } from "../models/objs/LightObj";
import { MeshHook, MeshObjFactory } from "../models/objs/MeshObj";
import { NodeConnectionObjFactory } from "../models/objs/NodeConnectionObj";
import { PathObjFactory } from "../models/objs/PathObj";
import { SpriteObjFactory } from "../models/objs/SpriteObj";
import { SpriteSheetObjFactory } from "../models/objs/SpriteSheetObj";
import { Registry } from "../Registry";

export class ObjService {
    private factoriesByType: Map<string, ObjFactory> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.registerObj(new MeshObjFactory(this.registry));
        this.registerObj(new PathObjFactory());
        this.registerObj(new SpriteObjFactory(this.registry));
        this.registerObj(new SpriteSheetObjFactory());
        this.registerObj(new AssetObjFactory());
        this.registerObj(new NodeConnectionObjFactory());
        this.registerObj(new LigthObjFactory(this.registry));
    }

    getRegisteredTypes(): string[] {
        return Array.from(this.factoriesByType.keys());
    }

    isRegistered(objType: string): boolean {
        return this.factoriesByType.has(objType);
    }

    registerObj(objFactory: ObjFactory) {
        this.factoriesByType.set(objFactory.objType, objFactory);
    }

    getObjFactory(objType: string): ObjFactory {
        return this.factoriesByType.get(objType);
    }

    createObj(objType: string): IObj {
        if (!this.factoriesByType.has(objType)) {
            throw new Error(`No factory for ObjType ${objType} exists`);
        }

        const obj = this.factoriesByType.get(objType).newInstance();
        obj.id = this.registry.stores.objStore.generateId(obj);
        return obj;
    }
}