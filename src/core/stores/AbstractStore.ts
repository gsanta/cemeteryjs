import { Polygon } from '../geometry/shapes/Polygon';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { View } from '../models/views/View';

export enum StoreChangeEvent {
    Delete = 'Delete'
}

export abstract class AbstractStore<T extends {id: string}> {
    id: string;
    protected maxIdForType: Map<string, number> = new Map();
    protected views: View[] = [];

    clear() {
        this.maxIdForType = new Map();
    }

    generateUniqueName(type: string) {
        const maxId = this.maxIdForType.get(type) || 0;
        const name = `${type}${maxId + 1}`.toLocaleLowerCase();
        return name;
    }

    listen(action: string, changedItems: any[]) {}

    // removeItem(item: )
}