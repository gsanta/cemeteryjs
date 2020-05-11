import { AbstractTool } from "./AbstractTool";
import { Registry } from "../../../core/Registry";
import { ToolType } from "./Tool";
import { Point } from "../../../core/geometry/shapes/Point";
import { UpdateTask } from "../../../core/services/UpdateServices";

export class JoinTool extends AbstractTool {
    start: Point;
    end: Point;

    constructor(registry: Registry) {
        super(ToolType.Join, registry);
    }

    down() {
        this.start = this.registry.services.pointer.pointer.curr;
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

    }
}