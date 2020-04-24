import { Stores } from "../../stores/Stores";
import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from "../ServiceLocator";

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

        console.log(this.getServices().pointer.wheelState)

        this.getStores().viewStore.getActiveView().getCamera().zoomWheel();
    
        return true;
    }

    finalize() {
        this.prevWheelState = undefined;
    }
}