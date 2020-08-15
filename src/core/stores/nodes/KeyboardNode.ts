import { NodeModel, BuiltinNodeType, NodeCategory, NodeModelJson } from "../game_objects/NodeModel";
import { Keyboard } from "../../services/input/KeyboardService";
import { View } from "../views/View";

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

export interface KeyboardNodeJson extends NodeModelJson {
    key: number;
}


export class KeyboardNode extends NodeModel {
    type = BuiltinNodeType.Keyboard;
    category = NodeCategory.Default;
    label = "Keyboard input";
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

    toJson(): KeyboardNodeJson {
        return {
            ...super.toJson(),
            key: this.key
        }
    }

    fromJson(json: KeyboardNodeJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.key = json.key;
    }
}