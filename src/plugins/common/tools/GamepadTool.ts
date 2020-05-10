import { Registry } from '../../../core/Registry';
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyGamepadStart } from '../hotkeys/HotkeyGamepadStart';
import { Keyboard, IKeyboardEvent } from '../../../core/services/input/KeyboardService';

export enum GamepadEvent {
    Forward = 'Forward',
    Backward = 'Backward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

export class GamepadTool extends AbstractTool {
    private downKeys: Set<GamepadEvent> = new Set();
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
        this.downKeys.add(action);
        this.registry.services.game.playerAction(Array.from(this.downKeys));
    }

    keyup(e: IKeyboardEvent) {
        const action = this.keyCodeToInputCommandMap.get(e.keyCode);
        this.downKeys.delete(action)
        this.registry.services.view.getHoveredView().removePriorityTool(this);
    }
}