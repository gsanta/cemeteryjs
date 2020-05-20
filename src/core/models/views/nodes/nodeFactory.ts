import { KeyboardNode } from "./KeyboardNode";
import { ActionNode } from "./ActionNode";
import { MeshNode } from "./MeshNode";
import { AndNode } from "./AndNode";
import { NodeType, AbstractNode } from "./AbstractNode";
import { AnimationNode } from "./AnimationNode";
import { NodeView } from '../NodeView';

export function createNode(actionType: string, nodeView: NodeView): AbstractNode {
    switch(actionType) {
        case NodeType.Keyboard:
            return new KeyboardNode(nodeView);
        case NodeType.Action:
            return new ActionNode(nodeView);
        case NodeType.Mesh:
            return new MeshNode(nodeView);
        case NodeType.And:
            return new AndNode(nodeView);
        case NodeType.Animation:
            return new AnimationNode(nodeView);
    }
}