import { ServiceLocator } from "../ServiceLocator";
import { Hotkey } from "../input/HotkeyService";
import { Wheel } from "../input/PointerService";
import { Stores } from "../../stores/Stores";
import { CanvasView } from "../../views/canvas/CanvasView";
import { ToolType } from "./Tool";
import { ZoomTool } from "./ZoomTool";

export class WheelZoomHotkey extends Hotkey {

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;
    private prevWheelState: number;

    constructor(getStores: () => Stores,getServices: () => ServiceLocator) {
        super('WheelZoom',  {ctrlOrCommand: true, wheel: true, worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.getServices = getServices;
        this.getStores = getStores;
    }

    private hotKeyAction(): boolean {
        if (this.prevWheelState === this.getServices().pointer.wheelState) { return false; }

        this.prevWheelState = this.getServices().pointer.wheelState;

        const point = this.getServices().pointer.pointer.curr;

        switch(this.getServices().pointer.wheel) {
            case Wheel.UP:
                this.getServices().camera.zoomToNextStep(point);
                break;
            case Wheel.DOWN:
                this.getServices().camera.zoomToPrevStep(point);
                break;
        }
    
        return true;
    }

    finalize() {
        this.prevWheelState = undefined;
    }
}