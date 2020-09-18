import { ViewSettings } from "../../../plugins/ui_plugins/AbstractSettings";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeObj, SlotName, NodeObjJson } from '../game_objects/NodeObj';
import { JoinPointView } from "./child_views/JoinPointView";
import { ViewType, View, ViewJson } from "./View";
import { Registry } from "../../Registry";
import { sizes } from "../../ui_components/react/styles";

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export interface NodeViewJson extends ViewJson {
    nodeObj: NodeObjJson;
}

const HEADER_HIGHT = 30;
const SLOT_HEIGHT = 20;
const INPUT_HEIGHT = 30;
const NODE_PADDING = 10;

export class NodeView extends View {
    readonly  viewType = ViewType.NodeView;
    id: string;
    obj: NodeObj;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;
    settings: ViewSettings<any, NodeView>;
    joinPointViews: JoinPointView[] = [];

    private paramsYPosStart: number;

    constructor(config?: {nodeType: string, dimensions?: Rectangle, node: NodeObj}) {
        super();
        
        if (config) {
            this.obj = config.node;
            this.obj.nodeView = this;
            this.dimensions = new Rectangle(new Point(0, 0), new Point(defaultNodeViewConfig.width, 0));
            this.setup();
        }
    }

    private setup() {

        
        const SLOTS_HEIGHT = this.obj.inputs.length > this.obj.outputs.length ? this.obj.inputs.length * SLOT_HEIGHT : this.obj.outputs.length * SLOT_HEIGHT;
        this.paramsYPosStart = HEADER_HIGHT + SLOTS_HEIGHT + NODE_PADDING; 
        const height = HEADER_HIGHT + SLOTS_HEIGHT + INPUT_HEIGHT * (this.obj.params.length ? this.obj.params.length : 1) + NODE_PADDING * 2;
        this.dimensions.setHeight(height);
        
        const standaloneJoinPointViews = [
            ...this.obj.inputs.map(slot => new JoinPointView(this, {slotName: slot.name, isInput: true})),
            ...this.obj.outputs.map(slot => new JoinPointView(this, {slotName: slot.name, isInput: false}))
        ];
        
        const paramRelatedJoinPointViews = this.obj.params.map(param => new JoinPointView(this, {slotName: param.name, isInput: false}));
        
        this.joinPointViews.push(...[...standaloneJoinPointViews, ...paramRelatedJoinPointViews]);

        this.initStandaloneJoinPointPositions(standaloneJoinPointViews);
        this.initParamRelatedJoinPointPositions(paramRelatedJoinPointViews);
    }

    private initStandaloneJoinPointPositions(joinPointViews: JoinPointView[]) {
        joinPointViews.forEach((joinPointView) => {
            const x = joinPointView.isInput ? 0 : this.dimensions.getWidth();
            const slotIndex = joinPointView.isInput ? this.obj.inputs.findIndex(slot => slot.name === joinPointView.slotName) : this.obj.outputs.findIndex(slot => slot.name === joinPointView.slotName);
            const y = slotIndex * sizes.nodes.slotHeight + sizes.nodes.slotHeight / 2 + sizes.nodes.headerHeight;
            joinPointView.point = new Point(x, y);
            joinPointView.dimensions = new Rectangle(new Point(x, y), new Point(x + 5, y + 5));
        });
    }

    private initParamRelatedJoinPointPositions(joinPointViews: JoinPointView[]) {
        joinPointViews.forEach(joinPointView => {
            const x = joinPointView.isInput ? 0 : this.dimensions.getWidth();
            const paramIndex = this.obj.params.findIndex(param => param.name === joinPointView.slotName);
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