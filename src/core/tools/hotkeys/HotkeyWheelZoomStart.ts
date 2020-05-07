import { Hotkey } from "../../services/input/HotkeyService";
import { Registry } from "../../../editor/Registry";

export class HotkeyWheelZoomStart extends Hotkey {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super('WheelZoom',  {wheel: true, worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.view.getHoveredView().getActiveTool() !== this.registry.services.tools.zoom) {
            this.registry.services.view.getHoveredView().setPriorityTool(this.registry.services.tools.zoom);
            return true;
        }
    }
}