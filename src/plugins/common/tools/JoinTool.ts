import { Point } from "../../../core/geometry/shapes/Point";
import { isJoinPointView, JoinPointView } from "../../../core/models/views/child_views/JoinPointView";
import { Registry } from "../../../core/Registry";
import { IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { RenderTask } from "../../../core/services/RenderServices";
import { AbstractTool } from "./AbstractTool";
import { ToolType, Cursor } from './Tool';
import { NodeConnectionView } from "../../../core/models/views/NodeConnectionView";
import { ConceptType } from "../../../core/models/views/View";

export class JoinTool extends AbstractTool {
    start: Point;
    end: Point;
    startItem: JoinPointView;

    constructor(registry: Registry) {
        super(ToolType.Join, registry);
    }

    down() {
        this.start = this.registry.services.pointer.pointer.curr;
        this.startItem = <JoinPointView> this.registry.services.pointer.hoveredItem;
        this.end = this.registry.services.pointer.pointer.curr;
        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
    }

    click() {

    }

    drag() {
        this.end = this.registry.services.pointer.pointer.curr;
        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
    }

    draggedUp() {
        this.registry.services.plugin.getHoveredView().removePriorityTool(this);

        if (isJoinPointView(this.registry.services.pointer.hoveredItem)) {
            const endItem = <JoinPointView> this.registry.services.pointer.hoveredItem;
            const id = this.registry.stores.nodeStore.generateUniqueName(ConceptType.ActionNodeConnectionConcept);
            const connection = new NodeConnectionView({joinPoint1: this.startItem, joinPoint2: endItem});
            this.startItem.connection = connection;
            endItem.connection = connection;
            this.registry.stores.nodeStore.addConnection(connection);
            this.start = undefined;
            this.end = undefined;
        }
    }

    out() {
        if (!this.registry.services.pointer.isDown) {
            this.registry.services.plugin.getHoveredView().removePriorityTool(this);
        }
    }

    hotkey(event: IHotkeyEvent) {
        if (event.isHover && isJoinPointView(this.registry.services.pointer.hoveredItem)) {
            this.registry.services.plugin.getHoveredView().setPriorityTool(this);
            return true;
        }
        return false;
    }

    getCursor() {
        return Cursor.Crosshair;
    }
}