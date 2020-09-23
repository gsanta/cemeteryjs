import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { AbstractController } from "../../plugin/controller/AbstractController";
import { Registry } from "../../Registry";
import { NodeGraph } from '../../services/node/NodeGraph';
import { sizes } from "../../ui_components/react/styles";
import { NodeObj, NodeObjJson } from '../objs/NodeObj';
import { JoinPointView } from "./child_views/JoinPointView";
import { View, ViewJson, ViewType } from "./View";

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export interface NodeViewJson extends ViewJson {
    nodeObj: NodeObjJson;
}

const HEADER_HIGHT = 30;
const SLOT_HEIGHT = 20;
const INPUT_HEIGHT = 35;
const NODE_PADDING = 10;

export class NodeView extends View {
    readonly  viewType = ViewType.NodeView;
    id: string;
    obj: NodeObj;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;
    joinPointViews: JoinPointView[] = [];

    controller: AbstractController<any>;

    private paramsYPosStart: number;

    constructor(config?: {nodeType: string, dimensions?: Rectangle, node: NodeObj}) {
        super();
        
        if (config) {
            this.obj = config.node;
            this.dimensions = new Rectangle(new Point(0, 0), new Point(defaultNodeViewConfig.width, 0));
            this.setup();
        }
    }

    private setup() {
        const standaloneJoinPointViews = [
            ...this.obj.inputs.map(slot => new JoinPointView(this, {slotName: slot.name, isInput: true})),
            ...this.obj.outputs.map(slot => new JoinPointView(this, {slotName: slot.name, isInput: false}))
        ];
        
        const paramRelatedJoinPointViews = this.obj.getParams()
            .filter(param => param.isLink && param.isLink !== 'none')
            .map(param => new JoinPointView(this, {slotName: param.name, isInput: false}));
        
        this.joinPointViews.push(...[...standaloneJoinPointViews, ...paramRelatedJoinPointViews]);
        this.updateDimensions();
    }

    updateDimensions() {
        const SLOTS_HEIGHT = this.obj.inputs.length > this.obj.outputs.length ? this.obj.inputs.length * SLOT_HEIGHT : this.obj.outputs.length * SLOT_HEIGHT;
        this.paramsYPosStart = HEADER_HIGHT + SLOTS_HEIGHT + NODE_PADDING; 
        const height = HEADER_HIGHT + SLOTS_HEIGHT + INPUT_HEIGHT * (this.obj.getParams().length ? this.obj.getParams().length : 1) + NODE_PADDING * 2;
        this.dimensions.setHeight(height);

        this.initStandaloneJoinPointPositions();
        this.initParamRelatedJoinPointPositions();
    }

    private initStandaloneJoinPointPositions() {
        this.joinPointViews.filter(joinPointView => !this.obj.hasParam(joinPointView.slotName)).forEach((joinPointView) => {
            const x = joinPointView.isInput ? 0 : this.dimensions.getWidth();
            const slotIndex = joinPointView.isInput ? this.obj.inputs.findIndex(slot => slot.name === joinPointView.slotName) : this.obj.outputs.findIndex(slot => slot.name === joinPointView.slotName);
            const y = slotIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + sizes.nodes.headerHeight;
            joinPointView.point = new Point(x, y);
            joinPointView.dimensions = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
        });
    }

    private initParamRelatedJoinPointPositions() {
        this.joinPointViews.filter(joinPointView => this.obj.hasParam(joinPointView.slotName)).forEach((joinPointView) => {
            const x = joinPointView.isInput ? 0 : this.dimensions.getWidth();
            const paramIndex = this.obj.getParams().findIndex(param => param.name === joinPointView.slotName);
            const y = paramIndex * INPUT_HEIGHT + this.paramsYPosStart + INPUT_HEIGHT / 2;
            joinPointView.point = new Point(x, y);
            joinPointView.dimensions = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
        });
    }

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        this.joinPointViews.forEach(joinPointView => joinPointView.move(point));
    }

    dispose(): void {
        this.obj.dispose();
    }

    findJoinPointView(name: string) {
        return this.joinPointViews.find(joinPointView => joinPointView.slotName === name);
    }
    
    toJson(): NodeViewJson  {
        return {
            ...super.toJson(),
            nodeObj: this.obj.toJson()
        }
    }

    fromJson(json: NodeViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.obj.fromJson(json.nodeObj, registry);
    }

    editPoints = [];
}