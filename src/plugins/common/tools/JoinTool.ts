import { Point } from "../../../core/geometry/shapes/Point";
import { isNodeConnectionControl, JoinPointView } from "../../../core/models/views/child_views/JoinPointView";
import { Registry } from "../../../core/Registry";
import { IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { UpdateTask } from "../../../core/services/UpdateServices";
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
            const endItem = <JoinPointView> this.registry.services.pointer.hoveredItem;
            const id = this.registry.stores.actionStore.generateUniqueName(ConceptType.ActionNodeConnectionConcept);
            const connection = new NodeConnectionView(id, this.startItem, endItem);
            this.startItem.connection = connection;
            endItem.connection = connection;
            this.registry.stores.actionStore.addConnection(connection);
            this.start = undefined;
            this.end = undefined;
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

    getCursor() {
        return Cursor.Crosshair;
    }
}