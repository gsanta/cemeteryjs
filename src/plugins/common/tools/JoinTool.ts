import { AbstractTool } from "./AbstractTool";
import { Registry } from "../../../core/Registry";
import { ToolType } from "./Tool";
import { Point } from "../../../core/geometry/shapes/Point";
import { UpdateTask } from "../../../core/services/UpdateServices";
import { defaultHotkeyTrigger, IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { isConcept } from "../../../core/stores/CanvasStore";
import { isNodeConnectionControl, NodeConnectionControl } from "../../../core/models/controls/NodeConnectionControl";

export class JoinTool extends AbstractTool {
    start: Point;
    end: Point;
    startItem: NodeConnectionControl;
    endItem: NodeConnectionControl;

    constructor(registry: Registry) {
        super(ToolType.Join, registry);
    }

    down() {
        this.start = this.registry.services.pointer.pointer.curr;
        this.startItem = <NodeConnectionControl> this.registry.services.pointer.hoveredItem;
        this.end = this.registry.services.pointer.pointer.curr;
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    click() {

    }

    drag() {
        this.end = this.registry.services.pointer.pointer.curr;
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    draggedUp() {
        this.registry.services.layout.getHoveredView().removePriorityTool(this);

        if (isNodeConnectionControl(this.registry.services.pointer.hoveredItem)) {
            const endItem = <NodeConnectionControl> this.registry.services.pointer.hoveredItem;
            this.registry.stores.actionStore.addConnection(this.startItem, endItem);
        }
    }

    out() {
        if (!this.registry.services.pointer.isDown) {
            this.registry.services.layout.getHoveredView().removePriorityTool(this);
        }
    }

    hotkey(event: IHotkeyEvent) {
        if (event.isHover && isNodeConnectionControl(this.registry.services.pointer.hoveredItem)) {
            this.registry.services.layout.getHoveredView().setPriorityTool(this);
            return true;
        }
        return false;
    }
}