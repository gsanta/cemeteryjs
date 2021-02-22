import { AbstractTool } from "../../../../../core/controller/tools/AbstractTool";
import { PointerToolLogicForSvgCanvas } from "../../../../../core/controller/tools/PointerTool";
import { Cursor, ToolType } from '../../../../../core/controller/tools/Tool';
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { NodePortShape, NodePortViewType } from "../../../../../core/models/shapes/child_views/NodePortShape";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { NodeConnectionShapeFactory } from "../../models/shapes/NodeConnectionShape";

export class JoinTool extends AbstractTool<AbstractShape> {
    startPoint: Point;
    endPoint: Point;
    nodePortView1: NodePortShape;
    private pointerTool: PointerToolLogicForSvgCanvas;

    constructor(canvas: Canvas2dPanel,  registry: Registry) {
        super(ToolType.Join, canvas, registry);
        this.pointerTool = new PointerToolLogicForSvgCanvas(registry, canvas);
    }

    down() {
        this.startPoint = this.canvas.pointer.pointer.curr;
        this.nodePortView1 = <NodePortShape> this.canvas.pointer.pointer.hoveredItem;
        this.endPoint = this.canvas.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    click() {}

    move() {}

    drag() {
        this.endPoint = this.canvas.pointer.pointer.curr;
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd() {
        this.canvas.tool.removePriorityTool(this.id);


        if (this.checkConnectionValidity()) {
            let inputPort = <NodePortShape> (this.nodePortView1.getObj().isInputPort() ? this.nodePortView1 : this.canvas.pointer.pointer.hoveredItem);
            let outputPort = <NodePortShape> (inputPort === this.nodePortView1 ? this.canvas.pointer.pointer.hoveredItem : this.nodePortView1);

            const connectionShape = new NodeConnectionShapeFactory(this.canvas as Canvas2dPanel).instantiate();
            inputPort.addConnection(connectionShape);
            outputPort.addConnection(connectionShape);
            connectionShape.setInputPort(inputPort);
            connectionShape.setOutputPort(outputPort);
            inputPort.getObj().addConnectedPort(outputPort.getObj());

            connectionShape.setInputPoint(inputPort.getAbsolutePosition());
            connectionShape.setOutputPoint(outputPort.getAbsolutePosition());
            this.registry.data.node.items.add(connectionShape);

            this.registry.services.history.createSnapshot();

            console.log((inputPort.containerShape.getObj() as NodeObj).getPorts().map(port => `${port.getNodeParam().name} ${port.hasConnectedPort()}`).join(', '))

        }

        this.startPoint = undefined;
        this.endPoint = undefined;
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private checkConnectionValidity() {
        const startPortView = this.nodePortView1;
        const endPortView = <NodePortShape> this.canvas.pointer.pointer.hoveredItem;

        if (!endPortView || !startPortView) { return false; }
        if (startPortView.viewType !== NodePortViewType || endPortView.viewType !== NodePortViewType) { return false; }

        if (startPortView.getObj().getNodeParam().portDirection === endPortView.getObj().getNodeParam().portDirection) { return false }

        return true;
    }

    out(view: AbstractShape) {
        this.pointerTool.unhover(view);
        if (!this.canvas.pointer.pointer.isDown) {
            this.canvas.tool.removePriorityTool(this.id);
        }
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    getCursor() {
        return Cursor.Crosshair;
    }
}