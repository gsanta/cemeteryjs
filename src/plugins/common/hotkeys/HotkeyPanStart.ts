import { Registry } from "../../../core/Registry";
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { Keyboard } from "../../../core/services/input/KeyboardService";
import { UpdateTask } from "../../../core/services/UpdateServices";

export class HotkeyPanStart extends Hotkey {
    constructor(registry: Registry) {
        super('HotkeyPanStart',  {keyCodes: [Keyboard.Space], worksDuringMouseDown: true}, () => this.hotKeyAction(), registry);

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.layout.getHoveredView().getActiveTool() !== this.registry.tools.pan) {
            this.registry.services.layout.getHoveredView().setPriorityTool(this.registry.tools.pan);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
            return true;
        }
    }
}