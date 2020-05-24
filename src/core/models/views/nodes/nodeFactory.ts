import { KeyboardNode } from "./KeyboardNode";
import { MoveNode } from "./MoveNode";
import { MeshNode } from "./MeshNode";
import { AndNode } from "./AndNode";
import { NodeType, NodeModel } from "./NodeModel";
import { AnimationNode } from "./AnimationNode";
import { NodeView } from '../NodeView';
import { TurnNode } from './TurnNode';
import { SplitNode } from './SplitNode';
import { RouteNode } from './RouteNode';
import { PathNode } from "./PathNode";

export function createNode(actionType: string, nodeView: NodeView): NodeModel {
    switch(actionType) {
        case NodeType.Keyboard:
            return new KeyboardNode(nodeView);
        case NodeType.Move:
            return new MoveNode(nodeView);
        case NodeType.Mesh:
            return new MeshNode(nodeView);
        case NodeType.And:
            return new AndNode(nodeView);
        case NodeType.Animation:
            return new AnimationNode(nodeView);
        case NodeType.Turn:
            return new TurnNode(nodeView);
        case NodeType.Split:
            return new SplitNode(nodeView);
        case NodeType.Route:
            return new RouteNode(nodeView);
        case NodeType.Path:
            return new PathNode(nodeView);
    }
}