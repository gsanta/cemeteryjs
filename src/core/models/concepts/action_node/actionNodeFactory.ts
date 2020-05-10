import { ActionType } from "../../../stores/ActionStore";
import { Registry } from "../../../Registry";
import { KeyboardActionNode } from "./KeyboardActionNode";

export function createActionNode(actionType: string, registry: Registry) {

    switch(actionType) {
        case ActionType.Keyboard:
            return new KeyboardActionNode();
    }
}