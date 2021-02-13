import { SketchEditorModule } from "../../../modules/sketch_editor/main/SketchEditorModule";
import { CanvasEventType } from "../../models/CanvasObservable";
import { AbstractShape, ShapeTag } from "../../models/shapes/AbstractShape";
import { IStore } from "./IStore";

export class SelectionStoreForSketchEditor implements IStore<AbstractShape> {
    private items: AbstractShape[] = [];
    private canvas: SketchEditorModule;

    constructor(canvas: SketchEditorModule) {
        this.canvas = canvas;
    }

    addItem(item: AbstractShape) {
        item.tags.add(ShapeTag.Selected)
        this.items.push(item);
        this.canvas.observable.emit({eventType: CanvasEventType.SelectionChanged});
    }

    removeItem(item: AbstractShape) {
        item.tags.delete(ShapeTag.Selected)
        this.items = this.items.filter(i => i !== item);
        this.canvas.observable.emit({eventType: CanvasEventType.SelectionChanged});
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
        this.items.forEach(item => item.tags.delete(ShapeTag.Selected));

        this.items = [];
        this.canvas.observable.emit({eventType: CanvasEventType.SelectionChanged});
    }

    generateId(): string {
        return undefined;
    }
}