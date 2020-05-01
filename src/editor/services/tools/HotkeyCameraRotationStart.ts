import { Registry } from "../../Registry";
import { Hotkey } from "../input/HotkeyService";

export class HotkeyCameraRotationStart extends Hotkey {
    private registry: Registry;

    constructor(registry: Registry) {
        super('CameraRotationStart',  {mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.stores.viewStore.getActiveView().getActiveTool() !== this.registry.services.tools.cameraRotate) {
            this.registry.stores.viewStore.getActiveView().setPriorityTool(this.registry.services.tools.cameraRotate);
            return true;
        }
    }
}