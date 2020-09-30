import { NodeConnectionObj, NodeConnectionObjType } from "../../../../core/models/objs/NodeConnectionObj";
import { JoinPointView, JoinPointViewType } from "../../../../core/models/views/child_views/JoinPointView";
import { NodeConnectionView, NodeConnectionViewType } from "../../../../core/models/views/NodeConnectionView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { ToolController } from "../../../../core/plugin/controller/ToolController";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { Cursor, ToolType } from '../../../../core/plugin/tools/Tool';
import { Registry } from "../../../../core/Registry";
import { Point } from "../../../../utils/geometry/shapes/Point";

export class JoinTool extends PointerTool {
    startPoint: Point;
    endPoint: Point;
    joinPoint1: JoinPointView;

    constructor(plugin: AbstractCanvasPlugin, toolController: ToolController, registry: Registry) {
        super(ToolType.Join, plugin, toolController, registry);
    }

    down() {
        this.startPoint = this.registry.services.pointer.pointer.curr;
        this.joinPoint1 = <JoinPointView> this.registry.services.pointer.hoveredItem;
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    click() {}

    move() {}

    drag() {
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    draggedUp() {
        this.registry.plugins.getHoveredPlugin().toolController.removePriorityTool(this.id);

        if (this.checkConnectionValidity()) {
            let joinPoint1 = this.joinPoint1;
            let joinPoint2 = <JoinPointView> this.registry.services.pointer.hoveredItem;
            if (joinPoint2.isInput) {
                [joinPoint1, joinPoint2] = [joinPoint2, joinPoint1];
            }

            const connectionObj = <NodeConnectionObj> this.registry.services.objService.createObj(NodeConnectionObjType);
            const connectionView = <NodeConnectionView> this.registry.services.viewService.createView(NodeConnectionViewType);
            connectionView.setObj(connectionObj);
            joinPoint1.connection = connectionView;
            joinPoint2.connection = connectionView;
            connectionView.joinPoint1 = joinPoint1;
            connectionView.joinPoint2 = joinPoint2;
            connectionObj.joinPoint1 = joinPoint1.slotName;
            connectionObj.node1 = joinPoint1.parent.getObj();
            connectionObj.joinPoint2 = joinPoint2.slotName;
            connectionObj.node2 = joinPoint2.parent.getObj();

            connectionView.setPoint1(joinPoint1.getAbsolutePosition());
            connectionView.setPoint2(joinPoint2.getAbsolutePosition());
            this.registry.stores.objStore.addObj(connectionObj);
            this.registry.stores.viewStore.addView(connectionView);

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
            this.registry.plugins.getHoveredPlugin().toolController.removePriorityTool(this.id);
        }

    }

    getCursor() {
        return Cursor.Crosshair;
    }
}