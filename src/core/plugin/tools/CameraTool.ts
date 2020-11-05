import { Registry } from '../../Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, Hotkey, HotkeyTrigger, IHotkeyEvent } from "../../services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from '../../services/input/KeyboardService';
import { IPointerEvent } from '../../services/input/PointerService';
import { NullTool } from './NullTool';
import { ToolType, Cursor } from "./Tool";
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Plugin } from '../UI_Plugin';

export const CameraToolId = 'camera-tool';
export class CameraTool extends NullTool {
    private panHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, keyCodes: [Keyboard.Space], worksDuringMouseDown: true};
    private rotationHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true};
    private zoomHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, wheel: true, worksDuringMouseDown: true};
    
    private defaultCameraAction: 'pan' = 'pan';
    private activeCameraAction: 'zoom' | 'pan' | 'rotate' = this.defaultCameraAction;
    private isSpaceDown: boolean;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(CameraToolId, plugin, registry);
    }

    wheel() {
        (this.panel.getPanel() as AbstractCanvasPanel).getCamera().zoomWheel();
    }

    wheelEnd() {
        this.activeCameraAction = this.defaultCameraAction;
        this.panel.getToolController().removePriorityTool(this.id)
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    drag(e: IPointerEvent) {
        super.drag(e);

        const camera = (this.panel.getPanel() as AbstractCanvasPanel).getCamera();

        switch(this.activeCameraAction) {
            case 'pan':
                camera.pan(this.registry.services.pointer.pointer);
                this.registry.services.render.scheduleRendering(this.panel.region);
                break;
            case 'rotate':
                camera.rotate(this.registry.services.pointer.pointer);
                this.registry.services.render.scheduleRendering(this.panel.region);
                break;
        }

        this.cleanupIfToolFinished(this.isSpaceDown, e.isCtrlDown);
    }

    zoomIn() {
        if ((this.panel.getPanel() as AbstractCanvasPanel).getCamera().zoomIn()) {
            this.registry.services.render.reRender(this.panel.region);
        }
    }

    zoomOut() {
        if ((this.panel.getPanel() as AbstractCanvasPanel).getCamera().zoomOut()) {
            this.registry.services.render.reRender(this.panel.region);
        }
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

        setAsPriorityTool && this.panel.getToolController().setPriorityTool(this.id);
        return setAsPriorityTool;
    }

    private cleanupIfToolFinished(panFinished: boolean, rotateFinished: boolean) {
        if (!panFinished && !rotateFinished) {
            this.activeCameraAction = this.defaultCameraAction;
            this.panel.getToolController().removePriorityTool(this.id);
            this.registry.services.render.scheduleRendering(this.registry.plugins.getHoveredPlugin().region);
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