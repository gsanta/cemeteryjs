import { Point } from "../../../../utils/geometry/shapes/Point";
import { JoinPointView, JoinPointViewType } from "../../../../core/models/views/child_views/JoinPointView";
import { NodeConnectionView } from "../../../../core/models/views/NodeConnectionView";
import { View } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { AbstractTool } from "../../../../core/plugin/tools/AbstractTool";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { Cursor, ToolType } from '../../../../core/plugin/tools/Tool';

export class JoinTool extends PointerTool {
    startPoint: Point;
    endPoint: Point;
    joinPoint1: JoinPointView;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Join, plugin, registry);
    }

    down() {
        this.startPoint = this.registry.services.pointer.pointer.curr;
        this.joinPoint1 = <JoinPointView> this.registry.services.pointer.hoveredItem;
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    click() {

    }

    move() {}

    drag() {
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    draggedUp() {
        this.registry.plugins.getHoveredPlugin().toolHandler.removePriorityTool(this.id);

        if (this.checkConnectionValidity()) {
            let joinPoint1 = this.joinPoint1;
            let joinPoint2 = <JoinPointView> this.registry.services.pointer.hoveredItem;
            if (joinPoint2.isInput) {
                [joinPoint1, joinPoint2] = [joinPoint2, joinPoint1];
            }

            const connection = new NodeConnectionView();
            joinPoint1.connection = connection;
            joinPoint2.connection = connection;
            connection.getObj().joinPoint1 = this.joinPoint1.slotName;
            connection.getObj().node1 = this.joinPoint1.parent.getObj();
            connection.getObj().joinPoint2 = joinPoint2.slotName;
            connection.getObj().node2 = joinPoint2.parent.getObj();

            connection.setPoint1(joinPoint1.getAbsolutePosition());
            connection.setPoint2(joinPoint2.getAbsolutePosition());
            this.joinPoint1.connection = connection;
            joinPoint2.connection = connection;
            this.registry.stores.viewStore.addView(connection);
            this.startPoint = undefined;
            this.endPoint = undefined;

            this.registry.services.history.createSnapshot();
        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private checkConnectionValidity() {
        const start = this.joinPoint1;
        const end = <JoinPointView> this.registry.services.pointer.hoveredItem;

        if (!end || !start) { return false; }
        if (start.viewType !== JoinPointViewType || end.viewType !== JoinPointViewType) { return false; }
        if (start.isInput === end.isInput) { return false }

        return true;
    }

    out(view: View) {
        super.out(view);
        if (!this.registry.services.pointer.isDown) {
            this.registry.plugins.getHoveredPlugin().toolHandler.removePriorityTool(this.id);
        }

    }

    getCursor() {
        return Cursor.Crosshair;
    }
}