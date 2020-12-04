import { NodeConnectionObj, NodeConnectionObjType } from "../../../../core/models/objs/NodeConnectionObj";
import { JoinPointView, JoinPointViewType } from "../../../../core/models/views/child_views/JoinPointView";
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
    joinPoint1: JoinPointView;

    constructor(plugin: AbstractCanvasPanel, viewStore: ViewStore,  registry: Registry) {
        super(ToolType.Join, plugin, viewStore, registry);
    }

    down() {
        this.startPoint = this.registry.services.pointer.pointer.curr;
        this.joinPoint1 = <JoinPointView> this.registry.services.pointer.hoveredView;
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
            let joinPoint2 = <JoinPointView> this.registry.services.pointer.hoveredView;
            if (joinPoint2.isInput) {
                [joinPoint1, joinPoint2] = [joinPoint2, joinPoint1];
            }

            const connectionView = <NodeConnectionView> this.registry.data.view.node.getViewFactory(NodeConnectionViewType).instantiate();
            joinPoint1.connection = connectionView;
            joinPoint2.connection = connectionView;
            connectionView.joinPoint1 = joinPoint1;
            connectionView.joinPoint2 = joinPoint2;

            const nodeObj1 = joinPoint1.containerView.getObj();
            const nodeObj2 = joinPoint2.containerView.getObj(); 
            nodeObj1.addConnection(joinPoint1.slotName, nodeObj2, joinPoint2.slotName);
            nodeObj2.addConnection(joinPoint2.slotName, nodeObj1, joinPoint1.slotName);

            connectionView.setPoint1(joinPoint1.getAbsolutePosition());
            connectionView.setPoint2(joinPoint2.getAbsolutePosition());
            this.registry.data.view.node.addView(connectionView);

            this.registry.services.history.createSnapshot();
        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    private checkConnectionValidity() {
        const start = this.joinPoint1;
        const end = <JoinPointView> this.registry.services.pointer.hoveredView;

        if (!end || !start) { return false; }
        if (start.viewType !== JoinPointViewType || end.viewType !== JoinPointViewType) { return false; }
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