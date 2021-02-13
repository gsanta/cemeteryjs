import { CanvasEventType } from "../../models/CanvasObservable";
import { Canvas3dPanel } from "../../models/modules/Canvas3dPanel";
import { IObj } from "../../models/objs/IObj";
import { IStore } from "./IStore";


export class SelectionStore_3D implements IStore<IObj> {
    private items: IObj[] = [];
    private canvas: Canvas3dPanel;
    
    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
    }

    addItem(item: IObj) {
        this.items.push(item);
        this.canvas.observable.emit({eventType: CanvasEventType.SelectionChanged});
    }

    removeItem(item: IObj) {
        this.items = this.items.filter(i => i !== item);
        this.canvas.observable.emit({eventType: CanvasEventType.SelectionChanged});
    }

    getItemById(id: string): IObj {
        return this.items.find(item => item.id === id);
    }

    getAllItems(): IObj[] {
        return this.items;
    }

    getItemsByType(type: string): IObj[] {
        return this.items.filter(item => item.objType === type);
    }

    find<T>(prop: (item: IObj) => T, expectedVal: T): IObj[] {
        throw new Error("Method not implemented.");
    }

    clear(): void {
        this.items = [];
        this.canvas.observable.emit({eventType: CanvasEventType.SelectionChanged});
    }

    generateId(): string {
        return undefined;
    }
}