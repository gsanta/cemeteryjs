import { KeyboardNode } from "./KeyboardNode";
import { MoveNode } from "./MoveNode";
import { MeshNode } from "./MeshNode";
import { AndNode } from "./AndNode";
import { NodeType } from "./INode";

export function createNode(actionType: string) {
    switch(actionType) {
        case NodeType.Keyboard:
            return new KeyboardNode();
        case NodeType.Move:
            return new MoveNode();
        case NodeType.Mesh:
            return new MeshNode();
        case NodeType.And:
            return new AndNode();
    }
}