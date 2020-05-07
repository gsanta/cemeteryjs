import { Registry } from '../../Registry';
import { Hotkey } from "../input/HotkeyService";
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType, Cursor } from "./Tool";
import { HotkeyPanStart } from './hotkeys/HotkeyPanStart';
import { Keyboard, IKeyboardEvent } from '../input/KeyboardService';

export class PanTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];
    cursor = Cursor.Grab;

    constructor(registry: Registry) {
        super(ToolType.Pan, registry);

        this.hotkeys = [new HotkeyPanStart(registry)];
    }

    setup() {
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    drag() {
        super.drag();
        const camera = this.registry.services.view.getHoveredView().getCamera();
        
        camera.pan(this.registry.services.pointer.pointer);

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    keyup(e: IKeyboardEvent): void {
        if (e.keyCode === Keyboard.Space && this.registry.services.view.getHoveredView().getActiveTool() === this) {
            this.registry.services.view.getHoveredView().removePriorityTool(this);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
        }
    }
}