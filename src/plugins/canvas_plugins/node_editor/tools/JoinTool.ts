import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodePortView, NodePortViewType } from "../../../../core/models/views/child_views/NodePortView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { Cursor, ToolType } from '../../../../core/plugin/tools/Tool';
import { Registry } from "../../../../core/Registry";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeConnectionView, NodeConnectionViewType } from "../views/NodeConnectionView";

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
            let inputPort = <NodePortView> (this.nodePortView1.getObj().isInputPort() ? this.nodePortView1 : this.registry.services.pointer.hoveredView);
            let outputPort = <NodePortView> (inputPort === this.nodePortView1 ? this.registry.services.pointer.hoveredView : this.nodePortView1);

            const connectionView = <NodeConnectionView> this.registry.data.view.node.getViewFactory(NodeConnectionViewType).instantiate();
            inputPort.addConnection(connectionView);
            outputPort.addConnection(connectionView);
            connectionView.setInputPort(inputPort);
            connectionView.setOutputPort(outputPort);
            inputPort.getObj().addConnectedPort(outputPort.getObj());

            connectionView.setInputPoint(inputPort.getAbsolutePosition());
            connectionView.setOutputPoint(outputPort.getAbsolutePosition());
            this.registry.data.view.node.addView(connectionView);

            this.registry.services.history.createSnapshot();

            console.log((inputPort.containerView.getObj() as NodeObj).getPorts().map(port => `${port.getNodeParam().name} ${port.hasConnectedPort()}`).join(', '))

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