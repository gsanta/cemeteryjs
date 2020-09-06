import { ViewSettings } from "../../../plugins/ui_plugins/AbstractSettings";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeObj, SlotName, NodeModelJson } from '../game_objects/NodeObj';
import { JoinPointView } from "./child_views/JoinPointView";
import { ViewType, View, ViewJson } from "./View";

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export interface NodeViewJson extends ViewJson {
    node: NodeModelJson;
}

const HEADER_HIGHT = 30;
const SLOT_HEIGHT = 20;
const INPUT_HEIGHT = 30;
const NODE_PADDING = 10;

export class NodeView extends View {
    readonly  viewType = ViewType.NodeView;
    id: string;
    model: NodeObj;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;
    settings: ViewSettings<any, NodeView>;

    joinPointViews: JoinPointView[] = [];

    constructor(nodeGraph: NodeGraph, config?: {nodeType: string, dimensions?: Rectangle, node: NodeObj}) {
        super();
        this.nodeGraph = nodeGraph;
        
        if (config) {
            this.model = config.node;
            this.model.nodeView = this;
            this.dimensions = config.dimensions;
            this.setup();
        }
    }

    private setup() {
        this.model.inputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, {slotName: slot.name, isInput: true})));
        this.model.outputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, {slotName: slot.name, isInput: false})));

        const SLOTS_HEIGHT = this.model.inputSlots.length > this.model.outputSlots.length ? this.model.inputSlots.length * SLOT_HEIGHT : this.model.outputSlots.length * SLOT_HEIGHT;
        const height = HEADER_HIGHT + SLOTS_HEIGHT + INPUT_HEIGHT * (this.model.params.length ? this.model.params.length : 1) + NODE_PADDING * 2;
        this.dimensions.setHeight(height);
    }

    move(point: Point) {
        this.dimensions = this.dimensions.translate(point);
        this.joinPointViews.forEach(joinPointView => joinPointView.move(point));
    }

    delete(): View[] {
        const deletingViews: View[] = [this];
        this.joinPointViews.forEach(view => deletingViews.push(...view.delete()));
        return Array.from(new Set(deletingViews));
    }

    findJoinPointView(name: SlotName) {
        return this.joinPointViews.find(joinPointView => joinPointView.slotName === name);
    }
    
    toJson(): NodeViewJson  {
        return {
            ...super.toJson(),
            node: this.model.toJson()
        }
    }

    fromJson(json: NodeViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        const obj = new NodeObj();
        obj.fromJson(json.node, viewMap);
        this.model = obj;
        this.setup();
    }

    editPoints = [];
}