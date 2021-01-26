import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodePortShape, NodePortViewType } from "../../../../../core/models/shapes/child_views/NodePortShape";
import { ShapeJson, AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { FormController, InputParamType } from "../../../../../core/controller/FormController";
import { Registry } from "../../../../../core/Registry";
import { NodeGraph } from "../../../../../core/services/node/NodeGraph";
import { sizes } from "../../../../../core/ui_components/react/styles";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { NodeRenderer } from "../../renderers/NodeRenderer";
import { UIController } from "../../../../../core/controller/UIController";

export const NodeShapeType = 'node-shape';

export const defaultNodeShapeConfig = {
    width: 200,
    height: 120
}

export interface NodeShapeJson extends ShapeJson {
}

const HEADER_HIGHT = 30;
const PORT_HEIGHT = 20;
const INPUT_HEIGHT = 35;
const NODE_PADDING = 10;

export class NodeHeightCalc {
    static getFieldHeights(nodeView: NodeShape) {
        const fieldParams = nodeView.getFieldParams();
        let sum = NODE_PADDING * 2;

        fieldParams.forEach(param => sum += this.getFieldHeight(nodeView, param));

        return sum;
    }

    static getFieldHeight(nodeView: NodeShape, nodeParam: NodeParam): number {

        switch(nodeView.paramController[nodeParam.name].paramType) {
            case InputParamType.MultiSelect:
                return 50;
            default:
                return 35;
        }
    }
}

export class NodeShape extends AbstractShape {
    readonly  viewType = NodeShapeType;
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
        this.bounds = new Rectangle(new Point(0, 0), new Point(defaultNodeShapeConfig.width, 0));
    }

    addParamControllers(paramControllers: UIController) {
        this.paramController = paramControllers;
        this.controller = new FormController(undefined, this.registry, [], paramControllers);
        this.setup();
    }

    getPortViews(): NodePortShape[] {
        return <NodePortShape[]> this.containedViews.filter((view: AbstractShape) => view.viewType === NodePortViewType)
    }

    setup() {
        this.obj.getPorts()
            .map(portObj => new NodePortShape(this, portObj))
            .forEach(portView => this.addContainedView(portView))
        this.updateDimensions();
    }

    private updateDimensions() {
        const inputPortLen = this.getStandaloneInputPorts().length;
        const outputPortLen = this.getStandaloneOutputPorts().length;
        const PORTS_HEIGHT = inputPortLen > outputPortLen ? inputPortLen * PORT_HEIGHT : outputPortLen * PORT_HEIGHT;
        this.paramsYPosStart = HEADER_HIGHT + PORTS_HEIGHT + NODE_PADDING;
        const inputFieldHeights = NodeHeightCalc.getFieldHeights(this);
        this.bounds.setHeight(inputFieldHeights + HEADER_HIGHT + PORTS_HEIGHT);

        this.initStandalonePortPositions();
        this.initPortsWithFieldPositions();
    }

    private initStandalonePortPositions() {
        const inputPorts = this.getStandaloneInputPorts();
        const outputPorts =  this.getStandaloneOutputPorts();
        
        this.containedViews
            .filter((portView: NodePortShape) => this.isStandalonePort(portView.getObj().getNodeParam()))
            .forEach((portView: NodePortShape) => {
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

    private initPortsWithFieldPositions() {
        this.containedViews
            .filter((portView: NodePortShape) => this.paramController[portView.getObj().getNodeParam().name])
            .forEach((portView: NodePortShape) => {
                const x = portView.getObj().isInputPort() ? 0 : this.bounds.getWidth();
                const fieldParams = this.getFieldParams();
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
        return this.containedViews.find((nodePortview: NodePortShape) => nodePortview.getObj().getNodeParam().name === name);
    }

    getDeleteOnCascadeViews(): AbstractShape[] {
        return [];
    }

    isStandalonePort(param: NodeParam) {
        return param.portDirection && !this.paramController[param.name];
    }

    getFieldParams(): NodeParam[] {
        return this.getObj().getParams().filter(param => this.paramController[param.name]);
    }

    getOutputPorts(): NodeParam[] {
        return this.getObj().getParams().filter(param => param.portDirection === PortDirection.Output);
    }

    getStandaloneOutputPorts(): NodeParam[] {
        return this.getOutputPorts().filter(param => !this.paramController[param.name]);
    }

    getStandaloneInputPorts(): NodeParam[] {
        return this.getInputPorts().filter(param => !this.paramController[param.name]);
    }
    
    getInputPorts(): NodeParam[] {
        return this.getObj().getParams().filter(param => param.portDirection === PortDirection.Input);
    }
    
    isPort(param: NodeParam) {
        return param.portDirection;
    }
    
    toJson(): NodeShapeJson  {
        return {
            ...super.toJson(),
        }
    }

    fromJson(json: NodeShapeJson, registry: Registry) {
        super.fromJson(json, registry);
    }

    private getJoinPointViews(): NodePortShape[] {
        return <NodePortShape[]> this.containedViews.filter(v => v.viewType === NodePortViewType);
    }
}