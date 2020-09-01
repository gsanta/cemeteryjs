import { IControlledObject, ObjectCapability } from '../IControlledObject';
import { View } from '../models/views/View';

export enum StoreChangeEvent {
    Delete = 'Delete'
}

export abstract class AbstractStore<T> implements IControlledObject {
    objectCapabilities = [ObjectCapability.Listener];

    id: string;
    protected prefixIndexCounter: Map<string, number> = new Map();
    protected views: View[] = [];

    clear() {
        this.prefixIndexCounter = new Map();
    }

    generateId(prefix: string) {
        const maxId = this.prefixIndexCounter.get(prefix) || 0;
        const name = `${prefix}${maxId + 1}`.toLocaleLowerCase();
        return name;
    }

    // removeItem(item: )
}