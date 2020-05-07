import { Hotkey } from "../../services/input/HotkeyService";
import { Registry } from "../../../editor/Registry";
import { Keyboard } from "../../services/input/KeyboardService";

export class HotkeyGamepadStart extends Hotkey {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super('GamepadStart',  {keyCodes: [Keyboard.a, Keyboard.d, Keyboard.e, Keyboard.w, Keyboard.s], worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.view.getHoveredView().getActiveTool() !== this.registry.services.tools.gamepad) {
            this.registry.services.view.getHoveredView().setPriorityTool(this.registry.services.tools.gamepad);
            return true;
        }
    }
}