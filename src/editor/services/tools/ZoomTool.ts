import { Stores } from '../../stores/Stores';
import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from '../UpdateServices';
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

    drag() {
        super.drag();
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        
        camera.pan(this.getServices().pointer.pointer);

        this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
    }
}