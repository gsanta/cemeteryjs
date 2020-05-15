import { ActionType } from "../../../stores/ActionStore";
import { Registry } from "../../../Registry";
import { KeyboardNode } from "./KeyboardNode";
import { MoveNode } from "./MoveNode";
import { MeshNode } from "./MeshNode";
import { AndNode } from "./AndNode";

export function createNode(actionType: string) {
    switch(actionType) {
        case ActionType.Keyboard:
            return new KeyboardNode();
        case ActionType.Move:
            return new MoveNode();
        case ActionType.Mesh:
            return new MeshNode();
        case ActionType.And:
            return new AndNode();
    }
}