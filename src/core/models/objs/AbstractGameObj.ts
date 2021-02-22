import { Point } from "../../../utils/geometry/shapes/Point";
import { Registry } from "../../Registry";
import { CanvasEventType } from "../CanvasObservable";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { ObjObservable } from "../ObjObservable";
import { AfterAllObjsDeserialized, IObj, ObjJson } from "./IObj";

export abstract class AbstractGameObj implements IObj {
    id: string;
    name: string;
    readonly objType: string;
    readonly canvas: Canvas3dPanel;
    readonly observable: ObjObservable;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
        this.observable = new ObjObservable();
    }
    
    private tags: Set<string> = new Set();
    abstract setParent(obj: AbstractGameObj): void;
    abstract getParent(): AbstractGameObj;
    
    abstract setScale(scale: Point);
    abstract getScale(): Point
    abstract setBoundingBoxVisibility(isVisible: boolean);
    abstract dispose(): void;
    abstract serialize(): ObjJson;
    abstract deserialize(json: ObjJson, registry: Registry): AfterAllObjsDeserialized;
    abstract clone(registry: Registry): IObj;


    addTag(tag: string): void {
        this.tags.add(tag);
        this.canvas.observable.emit({eventType: CanvasEventType.TagChanged, obj: this})
    }

    hasTag(tag: string): boolean {
        return this.tags.has(tag);
    }

    removeTag(tag: string): void {
        this.tags.delete(tag);
        this.canvas.observable.emit({eventType: CanvasEventType.TagChanged, obj: this})
    }

    clearTags(): void {
        this.tags.clear();
        this.canvas.observable.emit({eventType: CanvasEventType.TagChanged, obj: this})
    }

    getAllTags(): string[] {
        return Array.from(this.tags);
    }
}