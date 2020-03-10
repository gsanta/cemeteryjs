import { CanvasView } from "../views/canvas/CanvasView";
import { Stores } from '../stores/Stores';


export enum Keyboard {
    Enter = 13
}

export class KeyboardService {
    serviceName = 'keyboard-service'
    downKeys: number[] = [];

    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    onKeyDown(e: KeyboardEvent): void {
        this.downKeys.push(e.keyCode);
        this.getStores().viewStore.getActiveView().getActiveTool()?.keydown();
    }

    onKeyUp(e: KeyboardEvent): void {
        this.downKeys = this.downKeys.filter(k => k !== e.keyCode);
    }
}