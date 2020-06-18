import { Polygon } from '../geometry/shapes/Polygon';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { View } from '../models/views/View';


export abstract class AbstractStore {
    protected maxIdForType: Map<string, number> = new Map();
    protected views: View[] = [];77

    clear() {
        this.maxIdForType = new Map();
    }

    generateUniqueName(type: string) {
        const maxId = this.maxIdForType.get(type) || 0;
        const name = `${type}${maxId + 1}`.toLocaleLowerCase();
        return name;
    }
}