import { NodeModel, NodeType, NodeCategory } from "./NodeModel";
import { Keyboard } from "../../services/input/KeyboardService";

export function getAllKeys() {
    const keys: string[] = [];

    for (let item in Keyboard) {
        if (isNaN(Number(item))) {
            keys.push(item);
        }
    }

    return keys;
}

export enum KeyboardNodeSlot {
    Output = 'output'
}

export class KeyboardNode extends NodeModel {
    type = NodeType.Keyboard;
    category = NodeCategory.Default;
    title = "Keyboard input";
    key: Keyboard;
    color = '#89BD88';
    inputSlots = [];
    outputSlots = [
        {
            name: KeyboardNodeSlot.Output
        }
    ];

    findSlotByName(name: KeyboardNodeSlot) {
        return super.findSlotByName(name);
    }
}