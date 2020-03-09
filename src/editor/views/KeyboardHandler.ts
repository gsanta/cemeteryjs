import { CanvasView } from "./canvas/CanvasView";


export enum Keyboard {
    Enter = 13
}

export class KeyboardHandler {
    downKeys: number[] = [];

    private services: CanvasView;

    constructor(services: CanvasView) {
        this.services = services;
    }

    onKeyDown(e: KeyboardEvent): void {
        this.downKeys.push(e.keyCode);
        this.services.toolService.getActiveTool()?.keydown();
    }

    onKeyUp(e: KeyboardEvent): void {
        this.downKeys = this.downKeys.filter(k => k !== e.keyCode);
    }
}