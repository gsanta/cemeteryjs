import { CanvasWindow } from "../../windows/canvas/CanvasWindow";


export enum Keyboard {
    Enter = 13
}

export class KeyboardHandler {
    downKeys: number[] = [];

    private services: CanvasWindow;

    constructor(services: CanvasWindow) {
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