import { Registry } from '../../Registry';
import { Hotkey } from "../input/HotkeyService";
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType } from "./Tool";
import { HotkeyWheelZoomStart } from './hotkeys/HotkeyWheelZoomStart';

export class ZoomTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];

    constructor(registry: Registry) {
        super(ToolType.Zoom, registry);

        this.hotkeys = [new HotkeyWheelZoomStart(registry)];
    }

    setup() {
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    wheel() {
        this.registry.services.view.getActiveView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.registry.services.view.getActiveView().removePriorityTool(this.registry.services.tools.zoom);
    }
}