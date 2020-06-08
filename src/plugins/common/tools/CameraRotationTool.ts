import { Registry } from '../../../core/Registry';
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyCameraRotationStart } from '../hotkeys/HotkeyCameraRotationStart';
import { IKeyboardEvent, Keyboard } from '../../../core/services/input/KeyboardService';

export class CameraRotationTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];
    private cameraAction: 'Rotate' | 'Pan';

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

    down() {
        
    }

    drag() {
        super.drag();

        const camera = this.registry.services.plugin.getHoveredView().getCamera();

        if (this.cameraAction === 'Rotate') {
            camera.rotate(this.registry.services.pointer.pointer);
        } else if (this.cameraAction === 'Pan') {
            camera.pan(this.registry.services.pointer.pointer);
        }
        
        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
    }

    keydown(e: IKeyboardEvent) {
        let enterTool = false;
        if (e.isCtrlDown) {
            this.cameraAction = 'Rotate';
            enterTool = true;
        } else if (e.keyCode === Keyboard.Space) {
            this.cameraAction = 'Pan';
            enterTool = true;
        }

        if (enterTool) {
            this.registry.services.plugin.getHoveredView().setPriorityTool(this);
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
        }
    }

    keyup(e: IKeyboardEvent) {
        let exitTool = false;
        if (!e.isCtrlDown && this.cameraAction === 'Rotate') {
            this.cameraAction = undefined;
            exitTool = true;
        } else if (e.keyCode === Keyboard.Space && this.cameraAction === 'Pan') {
            this.cameraAction = undefined;
            exitTool = true;
        }

        if (exitTool) {
            this.registry.services.plugin.getHoveredView().removePriorityTool(this);
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
        }
    }

    draggedUp() {

    }

    leave() {

    }
}