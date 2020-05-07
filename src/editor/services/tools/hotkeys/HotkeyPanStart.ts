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
        if (this.registry.services.view.getHoveredView().getActiveTool() !== this.registry.services.tools.pan) {
            this.registry.services.view.getHoveredView().setPriorityTool(this.registry.services.tools.pan);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
            return true;
        }
    }
}