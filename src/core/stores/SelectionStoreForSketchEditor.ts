import { SketchEditorModule } from "../../modules/sketch_editor/main/SketchEditorModule";
import { ShapeEventType } from "../models/ShapeObservable";
import { AbstractShape } from "../models/shapes/AbstractShape";
import { IStore } from "./IStore";

export class SelectionStoreForSketchEditor implements IStore<AbstractShape> {
    private items: AbstractShape[] = [];
    private canvas: SketchEditorModule;

    constructor(canvas: SketchEditorModule) {
        this.canvas = canvas;
    }

    addItem(shape: AbstractShape) {
        this.items.push(shape);
        this.canvas.observable.emit({eventType: ShapeEventType.SelectionChanged});
    }

    removeItem(item: AbstractShape) {
        this.items = this.items.filter(i => i !== item);
        this.canvas.observable.emit({eventType: ShapeEventType.SelectionChanged});
    }

    getItemById(id: string): AbstractShape {
        return this.items.find(item => item.id === id);
    }

    getAllItems(): AbstractShape[] {
        return this.items;
    }

    getItemsByType(type: string): AbstractShape[] {
        return this.items.filter(item => item.viewType === type);
    }

    find<T>(prop: (item: AbstractShape) => T, expectedVal: T): AbstractShape[] {
        throw new Error("Method not implemented.");
    }

    clear(): void {
        this.items = [];
        this.canvas.observable.emit({eventType: ShapeEventType.SelectionChanged});
    }

    generateId(): string {
        return undefined;
    }
}