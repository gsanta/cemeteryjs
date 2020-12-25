

export class DragAndDropService {
    private listeners: (() => void)[] = [];
    isDragging: boolean;


    dragStart() {
        this.isDragging = true;
    }

    onDrop(listener: () => void) {
        this.listeners.push(listener);
    }

    emitDrop() {
        this.isDragging = false;
        this.listeners.forEach(listener => listener());
    }
}