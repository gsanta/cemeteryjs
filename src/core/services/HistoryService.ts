import { Registry } from '../Registry';
import { UpdateTask } from './UpdateServices';


export class HistoryService {
    serviceName = 'history-service';
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
            this.registry.stores.canvasStore.clear();
            this.registry.stores.hoverStore.clear();
            this.registry.stores.selectionStore.clear();
            this.registry.services.import.import(this.history[this.index]);
            this.registry.services.level.updateCurrentLevel();
            this.registry.services.update.runImmediately(UpdateTask.All);
        }
    }

    redo() {
        if (this.hasRedoHistory()) {
            this.index = this.index + 1;
            this.registry.stores.canvasStore.clear();
            this.registry.stores.hoverStore.clear();
            this.registry.stores.selectionStore.clear();
            this.registry.services.import.import(this.history[this.index]);
            this.registry.services.level.updateCurrentLevel();
            this.registry.services.update.runImmediately(UpdateTask.All);
        }
    }

    hasRedoHistory(): boolean {
        return this.history.length > 0 && this.index !== this.history.length - 1;
    }

    hasUndoHistory(): boolean {
        return this.history.length > 0 && this.index !== 0;
    }

    saveState(state: string) {
        this.history = this.history.slice(0, this.index + 1);
        this.history = this.history.length > this.memoryLimit ? this.history.slice(this.history.length - this.memoryLimit) : this.history;
        this.history.push(state);

        this.index = this.history.length - 1;
    }
}