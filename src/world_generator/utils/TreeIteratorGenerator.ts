import { GameObject } from '../services/GameObject';

export function* TreeIteratorGenerator(worldItem: GameObject): IterableIterator<GameObject> {

    yield worldItem;

    for (let child of worldItem.children || []) {
        yield * TreeIteratorGenerator(child);
    }
}
