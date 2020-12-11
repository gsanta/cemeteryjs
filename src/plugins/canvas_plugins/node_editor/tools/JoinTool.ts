import { NodePortView, NodePortViewType } from "../../../../core/models/views/child_views/NodePortView";
import { NodeConnectionView, NodeConnectionViewType } from "../../../../core/models/views/NodeConnectionView";
import { View } from "../../../../core/models/views/View";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { Cursor, ToolType } from '../../../../core/plugin/tools/Tool';
import { Registry } from "../../../../core/Registry";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { PortDirection } from "../../../../core/models/objs/NodeObj";

export class JoinTool extends PointerTool {
    startPoint: Point;
    endPoint: Point;
    nodePortView1: NodePortView;

    constructor(plugin: AbstractCanvasPanel, viewStore: ViewStore,  registry: Registry) {
        super(ToolType.Join, plugin, viewStore, registry);
    }

    down() {
        this.startPoint = this.registry.services.pointer.pointer.curr;
        this.nodePortView1 = <NodePortView> this.registry.services.pointer.hoveredView;
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
            let nodePortView1 = this.nodePortView1;
            let nodePortView2 = <NodePortView> this.registry.services.pointer.hoveredView;
            if (nodePortView2.getObj().getNodeParam().port.direction === PortDirection.Input) {
                [nodePortView1, nodePortView2] = [nodePortView2, nodePortView1];
            }

            const connectionView = <NodeConnectionView> this.registry.data.view.node.getViewFactory(NodeConnectionViewType).instantiate();
            nodePortView1.setConnection(connectionView);
            nodePortView2.setConnection(connectionView);
            connectionView.setNodePortView1(nodePortView1);
            connectionView.setNodePortView2(nodePortView2);

            nodePortView1.getObj().setConnectedPort(nodePortView2.getObj());

            connectionView.setPoint1(nodePortView1.getAbsolutePosition());
            connectionView.setPoint2(nodePortView2.getAbsolutePosition());
            this.registry.data.view.node.addView(connectionView);

            this.registry.services.history.createSnapshot();
        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    private checkConnectionValidity() {
        const startPortView = this.nodePortView1;
        const endPortView = <NodePortView> this.registry.services.pointer.hoveredView;

        if (!endPortView || !startPortView) { return false; }
        if (startPortView.viewType !== NodePortViewType || endPortView.viewType !== NodePortViewType) { return false; }

        if (startPortView.getObj().getNodeParam().port.direction === endPortView.getObj().getNodeParam().port.direction) { return false }

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