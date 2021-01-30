import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodePortShape, NodePortViewType } from "../../../../../core/models/shapes/child_views/NodePortShape";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { PointerTool } from "../../../../../core/plugin/tools/PointerTool";
import { Cursor, ToolType } from '../../../../../core/plugin/tools/Tool';
import { Registry } from "../../../../../core/Registry";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { NodeConnectionShape, NodeConnectionShapeType } from "../../models/shapes/NodeConnectionShape";

export class JoinTool extends PointerTool {
    startPoint: Point;
    endPoint: Point;
    nodePortView1: NodePortShape;

    constructor(plugin: AbstractCanvasPanel, viewStore: ShapeStore,  registry: Registry) {
        super(ToolType.Join, plugin, viewStore, registry);
    }

    down() {
        this.startPoint = this.canvas.pointer.pointer.curr;
        this.nodePortView1 = <NodePortShape> this.canvas.pointer.hoveredView;
        this.endPoint = this.canvas.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    click() {}

    move() {}

    drag() {
        this.endPoint = this.canvas.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    draggedUp() {
        this.canvas.toolController.removePriorityTool(this.id);


        if (this.checkConnectionValidity()) {
            let inputPort = <NodePortShape> (this.nodePortView1.getObj().isInputPort() ? this.nodePortView1 : this.canvas.pointer.hoveredView);
            let outputPort = <NodePortShape> (inputPort === this.nodePortView1 ? this.canvas.pointer.hoveredView : this.nodePortView1);

            const connectionView = <NodeConnectionShape> this.registry.data.shape.node.getViewFactory(NodeConnectionShapeType).instantiate();
            inputPort.addConnection(connectionView);
            outputPort.addConnection(connectionView);
            connectionView.setInputPort(inputPort);
            connectionView.setOutputPort(outputPort);
            inputPort.getObj().addConnectedPort(outputPort.getObj());

            connectionView.setInputPoint(inputPort.getAbsolutePosition());
            connectionView.setOutputPoint(outputPort.getAbsolutePosition());
            this.registry.data.shape.node.addShape(connectionView);

            this.registry.services.history.createSnapshot();

            console.log((inputPort.containerShape.getObj() as NodeObj).getPorts().map(port => `${port.getNodeParam().name} ${port.hasConnectedPort()}`).join(', '))

        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private checkConnectionValidity() {
        const startPortView = this.nodePortView1;
        const endPortView = <NodePortShape> this.canvas.pointer.hoveredView;

        if (!endPortView || !startPortView) { return false; }
        if (startPortView.viewType !== NodePortViewType || endPortView.viewType !== NodePortViewType) { return false; }

        if (startPortView.getObj().getNodeParam().portDirection === endPortView.getObj().getNodeParam().portDirection) { return false }

        return true;
    }

    out(view: AbstractShape) {
        super.out(view);
        if (!this.canvas.pointer.isDown) {
            this.canvas.toolController.removePriorityTool(this.id);
        }
    }

    getCursor() {
        return Cursor.Crosshair;
    }
}