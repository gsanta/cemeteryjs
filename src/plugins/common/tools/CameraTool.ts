import { Registry } from '../../../core/Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, Hotkey, HotkeyTrigger, IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from '../../../core/services/input/KeyboardService';
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractTool } from './AbstractTool';
import { ToolType, Cursor } from "./Tool";
import { AbstractPlugin } from '../../../core/AbstractPlugin';

export class CameraTool extends AbstractTool {
    private panHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, keyCodes: [Keyboard.Space], worksDuringMouseDown: true};
    private rotationHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true};
    private zoomHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, wheel: true, worksDuringMouseDown: true};
    
    private defaultCameraAction: 'pan' = 'pan';
    private activeCameraAction: 'zoom' | 'pan' | 'rotate' = this.defaultCameraAction;
    private isSpaceDown: boolean;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super(ToolType.Camera, plugin, registry);
    }

    wheel() {
        this.registry.services.plugin.getHoveredView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.activeCameraAction = this.defaultCameraAction;
        this.registry.services.plugin.getHoveredView().removePriorityTool(this);
        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);3
    }

    drag(e: IPointerEvent) {
        super.drag(e);

        const camera = this.registry.services.plugin.getHoveredView().getCamera();

        switch(this.activeCameraAction) {
            case 'pan':
                camera.pan(this.registry.services.pointer.pointer);
                this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
            break;
            case 'rotate':
                camera.rotate(this.registry.services.pointer.pointer);
                this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
            break;
        }

        this.cleanupIfToolFinished(this.isSpaceDown, e.isCtrlDown);
    }

    up(e: IPointerEvent) {
        super.up(e);

        this.cleanupIfToolFinished(this.isSpaceDown, false);
    }

    keyup(e: IKeyboardEvent) {
        this.isSpaceDown = e.keyCode === Keyboard.Space ? true : false;
        this.cleanupIfToolFinished(e.keyCode !== Keyboard.Space, e.isCtrlDown);
    }

    hotkey(event: IHotkeyEvent) {
        let setAsPriorityTool = false;

        if (checkHotkeyAgainstTrigger(event, this.panHotkeyTrigger, this.registry)) {
            this.activeCameraAction = 'pan';
            setAsPriorityTool = true;
        } else if (checkHotkeyAgainstTrigger(event, this.rotationHotkeyTrigger, this.registry)) {
            this.activeCameraAction = 'rotate';
            setAsPriorityTool = true;
        } else if (checkHotkeyAgainstTrigger(event, this.zoomHotkeyTrigger, this.registry)) {
            this.activeCameraAction = 'zoom';
            setAsPriorityTool = true;
        }

        setAsPriorityTool && this.registry.services.plugin.getHoveredView().setPriorityTool(this);
        return setAsPriorityTool;
    }

    private cleanupIfToolFinished(panFinished: boolean, rotateFinished: boolean) {
        if (!panFinished && !rotateFinished) {
            this.activeCameraAction = this.defaultCameraAction;
            this.registry.services.plugin.getHoveredView().removePriorityTool(this);
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
        }
    }

    getCursor() {
        switch(this.activeCameraAction) {
            case 'rotate':
                return Cursor.Grab;
            case 'zoom':
                return Cursor.ZoomIn;
            case 'pan':
            default:
                return Cursor.Move;
        }
    }
}