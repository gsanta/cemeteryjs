import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { IObj, ObjFactory, ObjFactoryAdapter, ObjJson } from "./IObj";

export const AssetObjType = 'asset-obj';

export interface AssetObjJson extends ObjJson {
    id: string;
    assetType: string;
    path?: string;
    data: string;
    name: string;
}

export enum AssetType {
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail',
    SpriteSheet = 'SpriteSheet',
    SpriteSheetJson = 'SpriteSheetJson'
}

export class AssetObjFactory extends ObjFactoryAdapter {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super(AssetObjType);
        this.registry = registry;
    }

    newInstance() {
        return new AssetObj(this.registry.services.module.ui.sceneEditor);
    }
}

export class AssetObj implements IObj {
    readonly objType = AssetObjType;
    name: string;
    id: string;
    assetType: AssetType;
    data: string;
    path: string;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel, config?: {data?: string, path?: string, name?: string, assetType: AssetType}) {
        this.canvas = canvas;
        if (config) {
            this.data = config.data;
            this.assetType = config.assetType;
            this.path = config.path;
            this.name = config.name;
        }
    }

    dispose() {}

    clone(): AssetObj {
        return new AssetObj(this.canvas, {data: this.data, path: this.path, name: this.name, assetType: this.assetType});
    }

    serialize(): AssetObjJson {
        return {
            id: this.id,
            objType: this.objType,
            assetType: this.assetType,
            path: this.path,
            data: this.data,
            name: this.name
        };
    }

    deserialize(json: AssetObjJson) {
        this.id = json.id;
        this.assetType = <AssetType> json.assetType;
        this.path = json.path;
        this.data = json.data;
        this.name = json.name;
    }
}