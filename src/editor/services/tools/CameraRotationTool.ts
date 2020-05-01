import { Stores } from '../../stores/Stores';
import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyCameraRotationStart } from './HotkeyCameraRotationStart';
import { Registry } from '../../Registry';

export class CameraRotationTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];

    constructor(registry: Registry) {
        super(ToolType.Zoom, registry);

        this.hotkeys = [new HotkeyCameraRotationStart(registry)];
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    wheel() {
        this.registry.stores.viewStore.getActiveView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.registry.stores.viewStore.getActiveView().removePriorityTool(this.registry.services.tools.zoom);
    }

    drag() {
        super.drag();
        const camera = this.registry.stores.viewStore.getActiveView().getCamera();
        
        camera.rotate(this.registry.services.pointer.pointer);

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    draggedUp() {

    }

    leave() {

    }
}