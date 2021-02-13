import { CanvasEventType } from "../../models/CanvasObservable";
import { AbstractCanvasPanel } from "../../models/modules/AbstractCanvasPanel";

export class TagStore<D> {
    private _canvas: AbstractCanvasPanel<D>;

    private map: Map<string, Set<D>> = new Map();

    constructor(canvas: AbstractCanvasPanel<D>) {
        this._canvas = canvas;
    }

    getTaggedItems(tag: string): Set<D> {
        return this.map.get(tag) || new Set();
    }

    tagItem(tag: string, item: D) {
        if (!this.map.has(tag)) {
            this.map.set(tag, new Set());
        }

        this.map.get(tag).add(item);

        this._canvas.observable.emit({eventType: CanvasEventType.TagChanged});
    }

    untagItem(tag: string, item: D) {
        this.map.get(tag).delete(item);
        this.removeTagIfEmpty(tag);
        this._canvas.observable.emit({eventType: CanvasEventType.TagChanged});
    }

    clearTag(tag: string) {
        this.map.get(tag).clear();
        this.removeTagIfEmpty(tag);
        this._canvas.observable.emit({eventType: CanvasEventType.TagChanged});
    }

    private removeTagIfEmpty(tag: string) {
        if (this.map.get(tag).size === 0) {
            this.map.delete(tag);
        }
    }
}