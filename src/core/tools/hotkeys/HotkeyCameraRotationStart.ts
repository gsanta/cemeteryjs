import { Hotkey } from "../../services/input/HotkeyService";
import { Registry } from "../../../editor/Registry";

export class HotkeyCameraRotationStart extends Hotkey {
    private registry: Registry;

    constructor(registry: Registry) {
        super('CameraRotationStart',  {mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true}, () => this.hotKeyAction());

        this.registry = registry;
    }

    private hotKeyAction(): boolean {
        if (this.registry.services.view.getHoveredView().getActiveTool() !== this.registry.services.tools.cameraRotate) {
            this.registry.services.view.getHoveredView().setPriorityTool(this.registry.services.tools.cameraRotate);
            return true;
        }
    }
}