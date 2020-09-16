import { ViewSettings } from "../../../plugins/ui_plugins/AbstractSettings";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeObj, SlotName, NodeObjJson } from '../game_objects/NodeObj';
import { JoinPointView } from "./child_views/JoinPointView";
import { ViewType, View, ViewJson } from "./View";
import { Registry } from "../../Registry";

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
        this.obj.inputs.forEach(slot => this.joinPointViews.push(new JoinPointView(this, {slotName: slot.name, isInput: true})));
        this.obj.outputs.forEach(slot => this.joinPointViews.push(new JoinPointView(this, {slotName: slot.name, isInput: false})));

        const SLOTS_HEIGHT = this.obj.inputs.length > this.obj.outputs.length ? this.obj.inputs.length * SLOT_HEIGHT : this.obj.outputs.length * SLOT_HEIGHT;
        const height = HEADER_HIGHT + SLOTS_HEIGHT + INPUT_HEIGHT * (this.obj.params.length ? this.obj.params.length : 1) + NODE_PADDING * 2;
        this.dimensions.setHeight(height);
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