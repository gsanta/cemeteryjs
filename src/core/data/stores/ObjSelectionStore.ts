import { IObj } from "../../models/objs/IObj";
import { IStore } from "./IStore";

export class ObjSelectionStore implements IStore<IObj> {
    private items: IObj[] = [];
    
    addItem(shape: IObj) {
        this.items.push(shape);
    }

    removeItem(item: IObj) {
        this.items = this.items.filter(i => i !== item);
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
    }

    generateId(): string {
        return undefined;
    }
}