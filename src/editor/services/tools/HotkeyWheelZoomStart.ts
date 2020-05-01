import { Registry } from "../../Registry";
import { Hotkey } from "../input/HotkeyService";

export class HotkeyWheelZoomStart extends Hotkey {
    private registry: Registry;
    
    constructor(registry: Registry) {
        super('WheelZoom',  {wheel: true, worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.stores.viewStore.getActiveView().getActiveTool() !== this.registry.services.tools.zoom) {
            this.registry.stores.viewStore.getActiveView().setPriorityTool(this.registry.services.tools.zoom);
            return true;
        }
    }
}