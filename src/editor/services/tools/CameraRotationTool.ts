import { Registry } from '../../Registry';
import { Hotkey } from "../input/HotkeyService";
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyCameraRotationStart } from './hotkeys/HotkeyCameraRotationStart';

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
        this.registry.services.view.getActiveView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.registry.services.view.getActiveView().removePriorityTool(this.registry.services.tools.zoom);
    }

    drag() {
        super.drag();
        const camera = this.registry.services.view.getActiveView().getCamera();
        
        camera.rotate(this.registry.services.pointer.pointer);

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    draggedUp() {

    }

    leave() {

    }
}