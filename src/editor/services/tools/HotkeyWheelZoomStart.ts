import { Stores } from "../../stores/Stores";
import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from "../ServiceLocator";

export class HotkeyWheelZoomStart extends Hotkey {

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getStores: () => Stores,getServices: () => ServiceLocator) {
        super('WheelZoom',  {wheel: true, worksDuringMouseDown: true}, () => this.hotKeyAction());

        this.getServices = getServices;
        this.getStores = getStores;
    }

    private hotKeyAction(): boolean {
        if (this.getStores().viewStore.getActiveView().getActiveTool() !== this.getServices().tools.zoom) {
            this.getStores().viewStore.getActiveView().setPriorityTool(this.getServices().tools.zoom);
            return true;
        }
    }
}