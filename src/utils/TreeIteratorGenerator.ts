import { WorldItem } from '../WorldItem';

export function* TreeIteratorGenerator(worldItem: WorldItem): IterableIterator<WorldItem> {

    yield worldItem;

    if (worldItem.iterable) {
        for (let child of worldItem.children || []) {
            yield * TreeIteratorGenerator(child);
        }
    }
}
