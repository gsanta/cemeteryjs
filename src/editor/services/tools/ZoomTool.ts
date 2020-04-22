import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from '../UpdateServices';
import { Stores } from '../../stores/Stores';
import { cameraInitializer, CanvasView } from '../../views/canvas/CanvasView';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { WheelZoomHotkey } from "./WheelZoomHotkey";

export class ZoomTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.Zoom, getServices, getStores);
        this.getServices = getServices;
        this.getStores = getStores;

        this.hotkeys = [new WheelZoomHotkey(getStores, getServices)];
        this.hotkeys.forEach(hk => this.getServices().hotkey.registerHotkey(hk));
    }

    resize() {
        const view = this.getStores().viewStore.getViewById<CanvasView>(CanvasView.id);

        const camera = view.getCamera();

        const prevScale = camera.getScale(); 
        const prevTranslate = camera.getTranslate(); 
    
        view.setCamera(cameraInitializer(view.getId(), this.getServices, this.getStores));
        view.getCamera().zoom(prevScale);
        view.getCamera().moveTo(prevTranslate.clone());

        this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
    }

    drag() {
        super.drag();
        const camera = this.getStores().viewStore.getActiveView().getCamera();

        const delta = this.getServices().pointer.pointer.getScreenDiff().div(camera.getScale());
        
        camera.moveBy(delta.negate());

        this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
    }
}