import { Registry } from '../../../core/Registry';
import { Hotkey } from "../../../core/services/input/HotkeyService";
import { UpdateTask } from '../../../core/services/UpdateServices';
import { AbstractTool } from './AbstractTool';
import { ToolType, Cursor } from "./Tool";
import { HotkeyWheelZoomStart } from '../hotkeys/HotkeyWheelZoomStart';

export class ZoomTool extends AbstractTool {
    private hotkeys: Hotkey[] = [];
    private cursor: Cursor;

    constructor(registry: Registry) {
        super(ToolType.Zoom, registry);

        this.hotkeys = [new HotkeyWheelZoomStart(registry)];
    }

    setup() {
        this.hotkeys.forEach(hk => this.registry.services.hotkey.registerHotkey(hk));
    }

    wheel() {
        this.cursor = Cursor.ZoomIn;
        this.registry.services.layout.getHoveredView().getCamera().zoomWheel();
    }

    wheelEnd() {
        this.cursor = Cursor.Default;
        this.registry.services.layout.getHoveredView().removePriorityTool(this.registry.tools.zoom);
    }

    getCursor() {
        return this.cursor;
    }
}