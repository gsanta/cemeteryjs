import { ViewSettings } from "../../../plugins/scene_editor/settings/AbstractSettings";
import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeModel, SlotName, NodeModelJson } from '../game_objects/NodeModel';
import { JoinPointView } from "./child_views/JoinPointView";
import { ViewType, View, ViewJson } from "./View";

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export interface NodeViewJson extends ViewJson {
    node: NodeModelJson;
}

export class NodeView<T extends NodeModel = NodeModel> extends View {
    readonly  viewType = ViewType.NodeView;
    id: string;
    model: T;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;
    settings: ViewSettings<any, NodeView>;

    joinPointViews: JoinPointView[] = [];

    constructor(nodeGraph: NodeGraph, config?: {nodeType: string, dimensions?: Rectangle, node: NodeModel}) {
        super();
        this.nodeGraph = nodeGraph;
        this.model = <T> config.node;
        this.model.nodeView = this;
        
        if (config) {
            this.dimensions = config.dimensions;
            this.setup();
        }
    }

    private setup() {
        this.model.inputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, {slotName: slot.name, isInput: true})));
        this.model.outputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, {slotName: slot.name, isInput: false})));
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
        this.setup();
        this.model.fromJson(json.node, viewMap);
    }

    editPoints = [];
}