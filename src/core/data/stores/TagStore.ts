
export class TagStore<D> {
    private map: Map<string, Set<D>> = new Map();


    getTaggedItems(tag: string): Set<D> {
        return this.map.get(tag) || new Set();
    }

    tagItem(tag: string, item: D) {
        if (!this.map.has(tag)) {
            this.map.set(tag, new Set());
        }

        this.map.get(tag).add(item);
    }

    untagItem(tag: string, item: D) {
        this.map.get(tag).delete(item);
        this.removeTagIfEmpty(tag);
    }

    clearTag(tag: string) {
        this.map.get(tag).clear();
        this.removeTagIfEmpty(tag);
    }

    private removeTagIfEmpty(tag: string) {
        if (this.map.get(tag).size === 0) {
            this.map.delete(tag);
        }
    }
}