import { Hotkey } from "../../../core/services/input/HotkeyService";
import { Registry } from "../../../core/Registry";
import { Keyboard } from "../../../core/services/input/KeyboardService";

export class HotkeyGamepadStart extends Hotkey {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super('GamepadStart',  {keyCodes: [Keyboard.a, Keyboard.d, Keyboard.e, Keyboard.w, Keyboard.s], worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.layout.getHoveredView().getActiveTool() !== this.registry.tools.gamepad) {
            this.registry.services.layout.getHoveredView().setPriorityTool(this.registry.tools.gamepad);
            return true;
        }
    }
}