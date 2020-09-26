import { AssetObjFactory } from "../models/objs/AssetObj";
import { IObj, ObjFactory } from "../models/objs/IObj";
import { MeshObjFactory } from "../models/objs/MeshObj";
import { NodeConnectionObjFactory } from "../models/objs/NodeConnectionObj";
import { NodeObjFactory } from "../models/objs/NodeObj";
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
        this.registerObj(new NodeObjFactory(this.registry));
        this.registerObj(new NodeConnectionObjFactory());
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

    createObj(objType: string): IObj {
        if (!this.factoriesByType.has(objType)) {
            throw new Error(`No factory for ObjType ${objType} exists`);
        }

        return this.factoriesByType.get(objType).newInstance();
    }
}