import { Stores } from "../../stores/Stores";
import { Hotkey } from "../input/HotkeyService";
import { ServiceLocator } from "../ServiceLocator";

export class HotkeyCameraRotationStart extends Hotkey {

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getStores: () => Stores,getServices: () => ServiceLocator) {
        super('CameraRotationStart',  {mouseDown: true, worksDuringMouseDown: true, ctrlOrCommand: true}, () => this.hotKeyAction());

        this.getServices = getServices;
        this.getStores = getStores;
    }

    private hotKeyAction(): boolean {
        if (this.getStores().viewStore.getActiveView().getActiveTool() !== this.getServices().tools.cameraRotate) {
            this.getStores().viewStore.getActiveView().setPriorityTool(this.getServices().tools.cameraRotate);
            return true;
        }
    }
}