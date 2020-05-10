import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";
import { Keyboard } from "../../../services/input/KeyboardService";

export function getAllKeys() {
    const keys: string[] = [];

    for (let item in Keyboard) {
        if (isNaN(Number(item))) {
            keys.push(item);
        }
    }

    return keys;
}

export class KeyboardActionNode implements IActionNode {
    type = ActionType.Keyboard;
    key: string;
}