import { NodeRenderer } from "../../../plugins/canvas_plugins/node_editor/NodeRenderer";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { FormController, ParamControllers } from "../../plugin/controller/FormController";
import { Registry } from "../../Registry";
import { NodeGraph } from '../../services/node/NodeGraph';
import { sizes } from "../../ui_components/react/styles";
import { NodeObj } from '../objs/node_obj/NodeObj';
import { NodeParam, NodeParamField } from "../objs/node_obj/NodeParam";
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

export class NodeHeightCalc {
    static getFieldHeights(nodeView: NodeView) {
        const fieldParams = NodeParam.getFieldParams(nodeView.getObj());
        let sum = NODE_PADDING * 2;

        fieldParams.forEach(param => sum += this.getFieldHeight(param));

        return sum;
    }

    static getFieldHeight(nodeParam: NodeParam): number {

        switch(nodeParam.field) {
            case NodeParamField.MultiList:
                return 50;
            default:
                return 35;
        }
    }
}

export class NodeView extends View {
    readonly  viewType = NodeViewType;
    id: string;
    protected obj: NodeObj;
    nodeGraph: NodeGraph;

    private paramsYPosStart: number;
    private registry: Registry;

    // TODO pass registry from the ui in every event handling method for FormController, so we don't need to pass it here
    constructor(registry: Registry) {
        super();
        
        this.registry = registry;
        this.renderer = new NodeRenderer(this);
        this.bounds = new Rectangle(new Point(0, 0), new Point(defaultNodeViewConfig.width, 0));
    }

    addParamControllers(paramControllers: ParamControllers) {
        this.paramController = paramControllers;
        this.controller = new FormController(undefined, this.registry, [], paramControllers);
    }

    getPortViews(): NodePortView[] {
        return <NodePortView[]> this.containedViews.filter((view: View) => view.viewType === NodePortViewType)
    }

    setup() {
        this.obj.getPorts()
            .map(portObj => new NodePortView(this, portObj))
            .forEach(portView => this.addContainedView(portView))
        this.updateDimensions();
    }

    private updateDimensions() {
        const inputPortLen = NodeParam.getStandaloneInputPorts(this.obj).length;
        const outputPortLen = NodeParam.getStandaloneOutputPorts(this.obj).length;
        const PORTS_HEIGHT = inputPortLen > outputPortLen ? inputPortLen * PORT_HEIGHT : outputPortLen * PORT_HEIGHT;
        this.paramsYPosStart = HEADER_HIGHT + PORTS_HEIGHT + NODE_PADDING;
        const inputFieldHeights = NodeHeightCalc.getFieldHeights(this);
        this.bounds.setHeight(inputFieldHeights + HEADER_HIGHT + PORTS_HEIGHT);

        this.initStandalonePortPositions();
        this.initParamRelatedJoinPointPositions();
    }

    private initStandalonePortPositions() {
        const inputPorts = NodeParam.getStandaloneInputPorts(this.obj);
        const outputPorts =  NodeParam.getStandaloneOutputPorts(this.obj);
        
        this.containedViews
            .filter((portView: NodePortView) => NodeParam.isStandalonePort(portView.getObj().getNodeParam()))
            .forEach((portView: NodePortView) => {
                const x = portView.getObj().isInputPort() ? 0 : this.bounds.getWidth();

                let portIndex: number;
                if(portView.getObj().isInputPort()) {
                    portIndex = inputPorts.findIndex(param => param.name === portView.getObj().getNodeParam().name);
                } else {
                    portIndex = outputPorts.findIndex(param => param.name === portView.getObj().getNodeParam().name)
                }     
                const y = portIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + sizes.nodes.headerHeight;
                portView.point = new Point(x, y);
                portView.bounds = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
            });
    }

    private initParamRelatedJoinPointPositions() {
        this.containedViews
            .filter((portView: NodePortView) => NodeParam.isFieldParam(portView.getObj().getNodeParam()))
            .forEach((portView: NodePortView) => {
                const x = portView.getObj().isInputPort() ? 0 : this.bounds.getWidth();
                const fieldParams = NodeParam.getFieldParams(this.obj);
                const paramIndex = fieldParams.findIndex(param => param.name === portView.getObj().getNodeParam().name);
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
        return this.containedViews.find((nodePortview: NodePortView) => nodePortview.getObj().getNodeParam().name === name);
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