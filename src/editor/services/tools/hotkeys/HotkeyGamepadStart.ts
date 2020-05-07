import { Hotkey } from "../../input/HotkeyService";
import { Registry } from "../../../Registry";
import { Keyboard } from "../../input/KeyboardService";

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