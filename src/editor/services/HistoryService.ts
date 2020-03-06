import { ServiceLocator } from '../ServiceLocator';


export class HistoryService {
    private history: string[] = [];
    private index = 0;
    private memoryLimit = 20;

    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator) {
        this.getServices = getServices;
    }

    undo() {
        if (this.hasUndoHistory()) {
            this.services.layers.feedback.clear();
            this.services.tags.untagAll();
            this.setActiveSnapshot(this.snapshots[this.getSnapshotPointerIndex() - 1]);
            this.services.layers.main.views = this.restoreFromSnapshot(this.snapshotPointer);
            this.services.render.reRender();
            this.services.log.logInfo('Undo.');
            this.getServices().
        }
    }

    redo() {

    }

    hasRedoHistory(): boolean {
        return this.history.length > 0 && this.index !== this.history.length - 1;
    }

    hasUndoHistory(): boolean {
        return this.history.length > 0 && this.index !== 0;
    }

    saveState(state: string) {
        const historyPointerIndex = this.history[this.index];

        this.history = this.history.slice(0, this.index + 1);
        this.history = this.history.length > this.memoryLimit ? this.history.slice(this.history.length - this.memoryLimit) : this.history;
        this.history.push(state);

        this.index = this.history.length - 1;
    }
}