import { INode, NodeType } from "./INode";
import { Keyboard } from "../../../services/input/KeyboardService";
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";

export function getAllKeys() {
    const keys: string[] = [];

    for (let item in Keyboard) {
        if (isNaN(Number(item))) {
            keys.push(item);
        }
    }

    return keys;
}

export class KeyboardNode implements INode {
    type = NodeType.Keyboard;
    group = NodeGroupName.Default;
    title = "Keyboard input";
    key: string;
    color = '#89BD88';
    inputSlots = 2;
    outputSlots = 1;
}