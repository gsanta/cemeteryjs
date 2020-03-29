import { Stores } from '../stores/Stores';

export enum Keyboard {
    Enter = 13
}

export interface IKeyboardEvent {
    keyCode: number;
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
}

export class KeyboardService {
    serviceName = 'keyboard-service'

    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    onKeyDown(e: KeyboardEvent): void {
        this.getStores().viewStore.getActiveView().getActiveTool()?.keydown(this.convertEvent(e));
    }

    private convertEvent(event: KeyboardEvent): IKeyboardEvent {
        return {
            keyCode: event.keyCode,
            isAltDown: !!event.altKey,
            isShiftDown: !!event.shiftKey,
            isCtrlDown: !!event.ctrlKey,
            isMetaDown: !!event.metaKey
        }
    }
}