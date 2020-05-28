import { Registry } from '../../../core/Registry';
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { UpdateTask } from '../../../core/services/UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType, Cursor } from "./Tool";
import { HotkeyPanStart } from '../hotkeys/HotkeyPanStart';
import { Keyboard, IKeyboardEvent } from '../../../core/services/input/KeyboardService';

export class PanTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];

    constructor(registry: Registry) {
        super(ToolType.Pan, registry);

        this.hotkeys = [new HotkeyPanStart(registry)];
    }

    setup() {
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    drag() {
        super.drag();
        const camera = this.registry.services.plugin.getHoveredView().getCamera();
        
        camera.pan(this.registry.services.pointer.pointer);

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    keyup(e: IKeyboardEvent): void {
        if (e.keyCode === Keyboard.Space && this.registry.services.plugin.getHoveredView().getActiveTool() === this) {
            this.registry.services.plugin.getHoveredView().removePriorityTool(this);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
        }
    }

    getCursor() {
        return Cursor.Move;
    }
}