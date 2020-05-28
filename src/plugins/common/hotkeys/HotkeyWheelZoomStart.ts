import { Hotkey } from "../../../core/services/input/HotkeyService";
import { Registry } from "../../../core/Registry";

export class HotkeyWheelZoomStart extends Hotkey {
    constructor(registry: Registry) {
        super('WheelZoom',  {wheel: true, worksDuringMouseDown: true}, () => this.hotKeyAction(), registry);

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.plugin.getHoveredView().getActiveTool() !== this.registry.tools.zoom) {
            this.registry.services.plugin.getHoveredView().setPriorityTool(this.registry.tools.zoom);
            return true;
        }
    }
}