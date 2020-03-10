import { CanvasView } from "./canvas/CanvasView";


export enum Keyboard {
    Enter = 13
}

export class KeyboardHandler {
    downKeys: number[] = [];

    private view: CanvasView;

    constructor(view: CanvasView) {
        this.view = view;
    }

    onKeyDown(e: KeyboardEvent): void {
        this.downKeys.push(e.keyCode);
        this.view.getActiveTool()?.keydown();
    }

    onKeyUp(e: KeyboardEvent): void {
        this.downKeys = this.downKeys.filter(k => k !== e.keyCode);
    }
}