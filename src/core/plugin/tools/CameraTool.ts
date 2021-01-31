import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from "../../controller/HotkeyHandler";
import { IKeyboardEvent, Keyboard } from '../../controller/KeyboardHandler';
import { PointerTracker } from "../../controller/PointerHandler";
import { Registry } from '../../Registry';
import { AbstractCanvasPanel, InteractionMode } from '../AbstractCanvasPanel';
import { Cursor } from "./Tool";
import { ToolAdapter } from './ToolAdapter';

export const CameraToolId = 'camera-tool';
export class CameraTool<D> extends ToolAdapter<D> {
    private panHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, keyCodes: [Keyboard.Space], worksDuringMouseDown: true};
    private rotationHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true};
    private zoomHotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, wheel: true, worksDuringMouseDown: true};
    
    private defaultCameraAction: 'pan' = 'pan';
    private activeCameraAction: 'zoom' | 'pan' | 'rotate' = this.defaultCameraAction;
    private isSpaceDown: boolean;

    constructor(panel: AbstractCanvasPanel<D>, registry: Registry) {
        super(CameraToolId, panel, registry);
    }

    wheel() {
        this.canvas.getCamera().zoomWheel(this.canvas.pointer.pointer);
    }

    wheelEnd() {
        this.activeCameraAction = this.defaultCameraAction;
        this.canvas.tool.removePriorityTool(this.id)
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    drag(pointer: PointerTracker<D>) {
        super.drag(pointer);

        const camera = this.canvas.getCamera();

        switch(this.activeCameraAction) {
            case 'pan':
                camera.pan(this.canvas.pointer.pointer);
                this.registry.services.render.scheduleRendering(this.canvas.region);
                break;
            case 'rotate':
                camera.rotate(this.canvas.pointer.pointer);
                this.registry.services.render.scheduleRendering(this.canvas.region);
                break;
        }

        this.cleanupIfToolFinished(this.isSpaceDown, pointer.lastPointerEvent ? pointer.lastPointerEvent.isCtrlDown : false);
    }

    zoomIn() {
        if (this.canvas.getCamera().zoomIn(this.canvas.pointer.pointer)) {
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    zoomOut() {
        if (this.canvas.getCamera().zoomOut(this.canvas.pointer.pointer)) {
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    up(pointer: PointerTracker<D>) {
        super.up(pointer);

        this.cleanupIfToolFinished(this.isSpaceDown, false);
    }

    keyup(e: IKeyboardEvent) {
        this.isSpaceDown = e.keyCode === Keyboard.Space ? true : false;
        this.cleanupIfToolFinished(e.keyCode !== Keyboard.Space, e.isCtrlDown);
    }

    hotkey(event: IHotkeyEvent) {
        const pointer = this.canvas.pointer.pointer;
        let setAsPriorityTool = false;

        if (this.canvas.interactionMode === InteractionMode.Edit) {
            if (checkHotkeyAgainstTrigger(event, this.panHotkeyTrigger, pointer)) {
                this.activeCameraAction = 'pan';
                setAsPriorityTool = true;
            } else if (checkHotkeyAgainstTrigger(event, this.rotationHotkeyTrigger, pointer)) {
                this.activeCameraAction = 'rotate';
                setAsPriorityTool = true;
            } else if (checkHotkeyAgainstTrigger(event, this.zoomHotkeyTrigger, pointer)) {
                this.activeCameraAction = 'zoom';
                setAsPriorityTool = true;
            }
    
            setAsPriorityTool && this.canvas.tool.setPriorityTool(this.id);
            return setAsPriorityTool;
        }

    }

    private cleanupIfToolFinished(panFinished: boolean, rotateFinished: boolean) {
        if (!panFinished && !rotateFinished) {
            this.activeCameraAction = this.defaultCameraAction;
            this.canvas.tool.removePriorityTool(this.id);
            this.registry.services.render.scheduleRendering(this.registry.ui.helper.hoveredPanel.region);
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