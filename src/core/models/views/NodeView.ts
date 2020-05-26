import { ViewSettings } from "../../../plugins/scene_editor/settings/AbstractSettings";
import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { NodeGraph } from '../../services/node/NodeGraph';
import { createNode } from "../nodes/nodeFactory";
import { NodeModel, SlotName } from '../nodes/NodeModel';
import { JoinPointView } from "./child_views/JoinPointView";
import { ConceptType, View } from "./View";

export const defaultNodeViewConfig = {
    width: 200,
    height: 120
}

export class NodeView<T extends NodeModel = NodeModel> extends View {
    readonly  type = ConceptType.ActionConcept;
    readonly id: string;
    model: T;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;
    settings: ViewSettings<any, NodeView>;

    joinPointViews: JoinPointView[] = [];

    constructor(id: string, nodeType: string, dimensions: Rectangle, nodeGraph: NodeGraph) {
        super();
        this.id = id;
        this.dimensions = dimensions;
        this.nodeGraph = nodeGraph;
        this.model = <T> createNode(nodeType, this);
        this.model.inputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, slot.name, true)));
        this.model.outputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, slot.name, false)));
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

    editPoints = [];
}