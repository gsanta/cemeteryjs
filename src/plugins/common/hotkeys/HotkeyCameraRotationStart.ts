import { Hotkey } from "../../../core/services/input/HotkeyService";
import { Registry } from "../../../core/Registry";

export class HotkeyCameraRotationStart extends Hotkey {
    private registry: Registry;

    constructor(registry: Registry) {
        super('CameraRotationStart',  {mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.layout.getHoveredView().getActiveTool() !== this.registry.tools.cameraRotate) {
            this.registry.services.layout.getHoveredView().setPriorityTool(this.registry.tools.cameraRotate);
            return true;
        }
    }
}