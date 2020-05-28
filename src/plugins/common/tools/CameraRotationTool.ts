import { Registry } from '../../../core/Registry';
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { UpdateTask } from '../../../core/services/UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyCameraRotationStart } from '../hotkeys/HotkeyCameraRotationStart';

export class CameraRotationTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];

    constructor(registry: Registry) {
        super(ToolType.Zoom, registry);

        this.hotkeys = [new HotkeyCameraRotationStart(registry)];
    }
    
    setup() {
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    wheel() {
        this.registry.services.plugin.getHoveredView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.registry.services.plugin.getHoveredView().removePriorityTool(this.registry.tools.zoom);
    }

    drag() {
        super.drag();
        const camera = this.registry.services.plugin.getHoveredView().getCamera();
        
        camera.rotate(this.registry.services.pointer.pointer);

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    draggedUp() {

    }

    leave() {

    }
}