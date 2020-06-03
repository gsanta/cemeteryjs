import { Registry } from "../../../core/Registry";
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { Keyboard } from "../../../core/services/input/KeyboardService";
import { RenderTask } from "../../../core/services/RenderServices";

export class HotkeyPanStart extends Hotkey {
    constructor(registry: Registry) {
        super('HotkeyPanStart',  {keyCodes: [Keyboard.Space], worksDuringMouseDown: true}, () => this.hotKeyAction(), registry);

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.plugin.getHoveredView().getActiveTool() !== this.registry.tools.pan) {
            this.registry.services.plugin.getHoveredView().setPriorityTool(this.registry.tools.pan);
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
            return true;
        }
    }
}