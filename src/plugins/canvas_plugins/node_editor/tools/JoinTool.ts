import { NodeConnectionObj, NodeConnectionObjType } from "../../../../core/models/objs/NodeConnectionObj";
import { NodePortView, NodePortViewType } from "../../../../core/models/views/child_views/NodePortView";
import { NodeConnectionView, NodeConnectionViewType } from "../../../../core/models/views/NodeConnectionView";
import { View } from "../../../../core/models/views/View";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { Cursor, ToolType } from '../../../../core/plugin/tools/Tool';
import { Registry } from "../../../../core/Registry";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";

export class JoinTool extends PointerTool {
    startPoint: Point;
    endPoint: Point;
    joinPoint1: NodePortView;

    constructor(plugin: AbstractCanvasPanel, viewStore: ViewStore,  registry: Registry) {
        super(ToolType.Join, plugin, viewStore, registry);
    }

    down() {
        this.startPoint = this.registry.services.pointer.pointer.curr;
        this.joinPoint1 = <NodePortView> this.registry.services.pointer.hoveredView;
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    click() {}

    move() {}

    drag() {
        this.endPoint = this.registry.services.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    draggedUp() {
        this.panel.toolController.removePriorityTool(this.id);


        if (this.checkConnectionValidity()) {
            let joinPoint1 = this.joinPoint1;
            let joinPoint2 = <NodePortView> this.registry.services.pointer.hoveredView;
            if (joinPoint2.isInput) {
                [joinPoint1, joinPoint2] = [joinPoint2, joinPoint1];
            }

            const connectionObj = <NodeConnectionObj> this.registry.services.objService.createObj(NodeConnectionObjType);
            const connectionView = <NodeConnectionView> this.registry.data.view.node.getViewFactory(NodeConnectionViewType).instantiate();
            connectionView.setObj(connectionObj);
            joinPoint1.connection = connectionView;
            joinPoint2.connection = connectionView;
            connectionView.joinPoint1 = joinPoint1;
            connectionView.joinPoint2 = joinPoint2;
            connectionObj.joinPoint1 = joinPoint1.port;
            connectionObj.node1 = joinPoint1.containerView.getObj();
            connectionObj.joinPoint2 = joinPoint2.port;
            connectionObj.node2 = joinPoint2.containerView.getObj();

            connectionView.setPoint1(joinPoint1.getAbsolutePosition());
            connectionView.setPoint2(joinPoint2.getAbsolutePosition());
            this.registry.stores.objStore.addObj(connectionObj);
            this.registry.data.view.node.addView(connectionView);

            this.registry.services.history.createSnapshot();
        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    private checkConnectionValidity() {
        const start = this.joinPoint1;
        const end = <NodePortView> this.registry.services.pointer.hoveredView;

        if (!end || !start) { return false; }
        if (start.viewType !== NodePortViewType || end.viewType !== NodePortViewType) { return false; }
        if (start.isInput === end.isInput) { return false }

        return true;
    }

    out(view: View) {
        super.out(view);
        if (!this.registry.services.pointer.isDown) {
            this.panel.toolController.removePriorityTool(this.id);
        }
    }

    getCursor() {
        return Cursor.Crosshair;
    }
}