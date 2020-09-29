import { Registry } from '../Registry';
import { RenderTask } from './RenderServices';


export class HistoryService {
    private history: string[] = [];
    private index = 0;
    private memoryLimit = 20;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    undo() {
        if (this.hasUndoHistory()) {
            this.index = this.index - 1;
            this.registry.stores.clear();
            this.registry.services.import.import(this.history[this.index]);
            this.registry.services.level.updateCurrentLevel();
            this.registry.services.render.reRenderAll();
        }
    }

    redo() {
        if (this.hasRedoHistory()) {
            this.index = this.index + 1;
            this.registry.stores.clear();
            this.registry.services.import.import(this.history[this.index]);
            this.registry.services.level.updateCurrentLevel();
            this.registry.services.render.reRenderAll();
        }
    }

    hasRedoHistory(): boolean {
        return this.history.length > 0 && this.index !== this.history.length - 1;
    }

    hasUndoHistory(): boolean {
        return this.history.length > 0 && this.index !== 0;
    }

    async createSnapshot() {
        const snapshot = this.registry.services.export.export();
        await this.registry.services.localStore.storeLevel(this.registry.stores.levelStore.currentLevel.index, snapshot);

        this.history = this.history.slice(0, this.index + 1);
        this.history = this.history.length > this.memoryLimit ? this.history.slice(this.history.length - this.memoryLimit) : this.history;
        this.history.push(snapshot);

        this.index = this.history.length - 1;
    }
}