import { Point } from "../../geometry/shapes/Point";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { VisualConcept } from "../concepts/VisualConcept";
import { JoinPointView } from "./child_views/JoinPointView";
import { AbstractNode } from "./nodes/AbstractNode";
import { createNode } from "./nodes/nodeFactory";
import { ConceptType, View } from "./View";
import { NodeGraph } from '../../services/node/NodeGraph';

export class NodeView<T extends AbstractNode = AbstractNode> extends VisualConcept {
    readonly  type = ConceptType.ActionConcept;
    readonly id: string;
    node: T;
    dimensions: Rectangle;
    nodeGraph: NodeGraph;

    joinPointViews: JoinPointView[] = [];

    constructor(id: string, nodeType: string, dimensions: Rectangle, nodeGraph: NodeGraph) {
        super();
        this.id = id;
        this.dimensions = dimensions;
        this.nodeGraph = nodeGraph;
        this.node = <T> createNode(nodeType, this);
        this.node.inputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, slot.name, true)));
        this.node.outputSlots.forEach(slot => this.joinPointViews.push(new JoinPointView(this, slot.name, false)));
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

    findJoinPointView(name: string, isInput: boolean) {
        return this.joinPointViews.find(joinPointView => joinPointView.isInput === isInput && joinPointView.slotName === name);
    }

    editPoints = [];
}