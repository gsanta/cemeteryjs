import { Registry } from "../../../Registry";
import { Hotkey } from "../../input/HotkeyService";
import { Keyboard } from "../../input/KeyboardService";
import { UpdateTask } from "../../UpdateServices";

export class HotkeyPanStart extends Hotkey {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super('HotkeyPanStart',  {keyCodes: [Keyboard.Space], worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.stores.viewStore.getActiveView().getActiveTool() !== this.registry.services.tools.pan) {
            this.registry.stores.viewStore.getActiveView().setPriorityTool(this.registry.services.tools.pan);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
            return true;
        }
    }
}