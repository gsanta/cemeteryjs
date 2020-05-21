import { Registry } from '../Registry';
import { Hotkey, IHotkeyEvent } from './input/HotkeyService';
import { Keyboard } from './input/KeyboardService';

export enum GamepadEvent {
    Forward = 'Forward',
    Backward = 'Backward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

export class GamepadService extends Hotkey {
    private listeners: ((keys: Keyboard[]) => void)[] = [];
    downKeys: Set<number> = new Set();

    constructor(registry: Registry) {
        super('Gamepad',  { keyCodes: [Keyboard.w, Keyboard.s, Keyboard.a, Keyboard.e]}, (event: IHotkeyEvent) => this.hotKeyAction(event), registry);
    }

    registerGamepadListener(listener: (keys: Keyboard[]) => void) {
        this.listeners.push(listener);
    }

    unregisterGamepadListener(listener: (keys: Keyboard[]) => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private hotKeyAction(event: IHotkeyEvent): boolean {
        if (event.isKeyup) {
            this.downKeys.delete(event.keyCode);
        } else {
            this.downKeys.add(event.keyCode);
        }

        this.listeners.forEach(listener => listener(Array.from(this.downKeys)));

        return true;
    }
}