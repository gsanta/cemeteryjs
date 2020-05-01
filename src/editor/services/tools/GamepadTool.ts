import { Registry } from '../../Registry';
import { Hotkey } from "../input/HotkeyService";
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyGamepadStart } from './hotkeys/HotkeyGamepadStart';
import { Keyboard, IKeyboardEvent } from '../input/KeyboardService';

export enum GamepadEvent {
    Forward = 'Forward',
    Backward = 'Backward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

export class GamepadTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];
    private keyCodeToInputCommandMap: Map<Keyboard, GamepadEvent> = new Map(
        [
            [Keyboard.w, GamepadEvent.Forward],
            [Keyboard.s, GamepadEvent.Backward],
            [Keyboard.a, GamepadEvent.TurnLeft],
            [Keyboard.e, GamepadEvent.TurnRight],
        ]
    );

    constructor(registry: Registry) {
        super(ToolType.Gamepad, registry);

        this.hotkeys = [new HotkeyGamepadStart(registry)];
    }

    setup() {
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    keydown(e: IKeyboardEvent) {
        const action = this.keyCodeToInputCommandMap.get(e.keyCode);
        this.registry.services.game.playerAction(action);
    }

    keyup() {
        this.registry.stores.viewStore.getActiveView().removePriorityTool(this);
    }
}