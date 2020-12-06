import { NodeRenderer } from "../../../plugins/canvas_plugins/node_editor/NodeRenderer";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { FormController, PropController } from "../../plugin/controller/FormController";
import { Registry } from "../../Registry";
import { NodeGraph } from '../../services/node/NodeGraph';
import { sizes } from "../../ui_components/react/styles";
import { NodeObj } from '../objs/NodeObj';
import { NodePortView, NodePortViewType } from "./child_views/NodePortView";
import { View, ViewJson } from "./View";

export const NodeViewType = 'node-view';

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export interface NodeViewJson extends ViewJson {
}

const HEADER_HIGHT = 30;
const PORT_HEIGHT = 20;
const INPUT_HEIGHT = 35;
const NODE_PADDING = 10;

export class NodeView extends View {
    readonly  viewType = NodeViewType;
    id: string;
    protected obj: NodeObj;
    nodeGraph: NodeGraph;

    private paramsYPosStart: number;

    // TODO pass registry from the ui in every event handling method for FormController, so we don't need to pass it here
    constructor(registry: Registry) {
        super();
        
        this.controller = new FormController(undefined, registry);
        this.renderer = new NodeRenderer(this);
        this.bounds = new Rectangle(new Point(0, 0), new Point(defaultNodeViewConfig.width, 0));
    }

    addParamController(...paramControllers: PropController[]) {
        paramControllers.forEach(paramController => this.controller.registerPropControl(paramController));
    }

    setup() {
        this.obj.getParams()
            .filter(param => param.port)
            .map(param => new NodePortView(this, {portName: param.name, portDirection: param.port}))
            .forEach(portView => this.addContainedView(portView))
        this.updateDimensions();
    }

    private updateDimensions() {
        const inputPortLen = this.obj.getInputPorts().filter(port => !port.uiOptions).length;
        const outputPortLen = this.obj.getOutputPorts().filter(port => !port.uiOptions).length;
        const PORTS_HEIGHT = inputPortLen > outputPortLen ? inputPortLen * PORT_HEIGHT : outputPortLen * PORT_HEIGHT;
        this.paramsYPosStart = HEADER_HIGHT + PORTS_HEIGHT + NODE_PADDING;
        const uiParams = this.obj.getUIParams().filter(param => param.uiOptions);
        const height = HEADER_HIGHT + PORTS_HEIGHT + INPUT_HEIGHT * (uiParams.length ? uiParams.length : 1) + NODE_PADDING * 2;
        this.bounds.setHeight(height);

        this.initStandaloneJoinPointPositions();
        this.initParamRelatedJoinPointPositions();
    }

    private initStandaloneJoinPointPositions() {
        const inputPorts = this.obj.getInputPorts();
        const outputPorts = this.obj.getOutputPorts();
        
        this.containedViews
            .filter((portView: NodePortView) => !this.obj.getParam(portView.port).uiOptions)
            .forEach((portView: NodePortView) => {
                const x = portView.portDirection === 'input' ? 0 : this.bounds.getWidth();

                const slotIndex = portView.portDirection === 'input' ? inputPorts.findIndex(slot => slot.name === portView.port) : outputPorts.findIndex(slot => slot.name === portView.port);
                const y = slotIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + sizes.nodes.headerHeight;
                portView.point = new Point(x, y);
                portView.bounds = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
            });
    }

    private initParamRelatedJoinPointPositions() {
        this.containedViews
            .filter((portView: NodePortView) => this.obj.getParam(portView.port).uiOptions)
            .forEach((portView: NodePortView) => {
                const x = portView.portDirection === 'input' ? 0 : this.bounds.getWidth();
                const paramIndex = this.obj.getUIParams().findIndex(param => param.name === portView.port);
                const y = paramIndex * INPUT_HEIGHT + this.paramsYPosStart + INPUT_HEIGHT / 2;
                portView.point = new Point(x, y);
                portView.bounds = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
            });
    }

    getObj(): NodeObj {
        return this.obj;
    }

    setObj(obj: NodeObj) {
        this.obj = obj;
        this.setup();
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.containedViews.forEach(joinPointView => joinPointView.move(point));
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose(): void {
        this.obj.dispose();
        this.getJoinPointViews().forEach(joinPointView => joinPointView.dispose());
    }

    findJoinPointView(name: string) {
        return this.containedViews.find((joinPointView: NodePortView) => joinPointView.port === name);
    }

    getDeleteOnCascadeViews(): View[] {
        return [];
    }
    
    toJson(): NodeViewJson  {
        return {
            ...super.toJson(),
        }
    }

    fromJson(json: NodeViewJson, registry: Registry) {
        super.fromJson(json, registry);
    }

    private getJoinPointViews(): NodePortView[] {
        return <NodePortView[]> this.containedViews.filter(v => v.viewType === NodePortViewType);
    }
}