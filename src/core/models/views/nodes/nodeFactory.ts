import { KeyboardNode } from "./KeyboardNode";
import { ActionNode } from "./ActionNode";
import { MeshNode } from "./MeshNode";
import { AndNode } from "./AndNode";
import { NodeType, AbstractNode } from "./AbstractNode";
import { AnimationNode } from "./AnimationNode";

export function createNode(actionType: string): AbstractNode {
    switch(actionType) {
        case NodeType.Keyboard:
            return new KeyboardNode();
        case NodeType.Move:
            return new ActionNode();
        case NodeType.Mesh:
            return new MeshNode();
        case NodeType.And:
            return new AndNode();
        case NodeType.Animation:
            return new AnimationNode();
    }
}