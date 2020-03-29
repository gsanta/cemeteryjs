import { ServiceLocator } from "../../../../services/ServiceLocator";
import { Hotkey } from "../../../../services/HotkeyService";
import { Wheel } from "../../../../services/PointerService";
import { Stores } from "../../../../stores/Stores";
import { CanvasView } from "../../CanvasView";
import { ToolType } from "../Tool";
import { CameraTool } from "./CameraTool";

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
        if (this.prevWheelState === this.getServices().pointerService().wheelState) { return false; }

        this.prevWheelState = this.getServices().pointerService().wheelState;

        const point = this.getServices().pointerService().pointer.curr;

        // TODO: make it work for general camera tool (both canvas and renderer camera tools)
        const cameraTool = <CameraTool> (<CanvasView> this.getStores().viewStore.getViewById(CanvasView.id)).getToolByType(ToolType.CAMERA);
        
        switch(this.getServices().pointerService().wheel) {
            case Wheel.UP:
                cameraTool.zoomToNextStep(point);
                break;
            case Wheel.DOWN:
                cameraTool.zoomToPrevStep(point);
                break;
        }
    
        return true;
    }

    finalize() {
        this.prevWheelState = undefined;
    }
}