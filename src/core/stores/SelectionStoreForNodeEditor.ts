import { AbstractShape } from "../models/shapes/AbstractShape";
import { IStore } from "./IStore";

export class SelectionStoreForNodeEditor implements IStore<AbstractShape> {
    private items: AbstractShape[] = [];

    addItem(shape: AbstractShape) {
        this.items.push(shape);
    }

    removeItem(item: AbstractShape) {
        this.items = this.items.filter(i => i !== item);
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
    }

    generateId(): string {
        return undefined;
    }
}