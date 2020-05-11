import { ActionType } from "../../../stores/ActionStore";
import { Registry } from "../../../Registry";
import { KeyboardActionNode } from "./KeyboardActionNode";
import { MoveActionNode } from "./MoveActionNode";
import { MeshActionNode } from "./MeshActionNode";
import { AndActionNode } from "./AndActionNode";

export function createActionNode(actionType: string) {
    switch(actionType) {
        case ActionType.Keyboard:
            return new KeyboardActionNode();
        case ActionType.Move:
            return new MoveActionNode();
        case ActionType.Mesh:
            return new MeshActionNode();
        case ActionType.And:
            return new AndActionNode();
    }
}