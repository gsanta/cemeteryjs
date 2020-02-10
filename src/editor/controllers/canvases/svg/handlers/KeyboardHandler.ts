import { CanvasController } from "../CanvasController";


export enum Keyboard {
    Enter = 13
}

export class KeyboardHandler {
    downKeys: number[] = [];

    private services: CanvasController;

    constructor(services: CanvasController) {
        this.services = services;
    }

    onKeyDown(e: KeyboardEvent): void {
        this.downKeys.push(e.keyCode);
        this.services.getActiveTool()?.keydown();
    }

    onKeyUp(e: KeyboardEvent): void {
        this.downKeys = this.downKeys.filter(k => k !== e.keyCode);
    }
}